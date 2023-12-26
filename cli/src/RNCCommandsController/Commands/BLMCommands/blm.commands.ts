import { inject, injectable } from 'inversify'
import { EBlmVariants, IBlmCommands, VARIANT_OPTIONS } from './types'
import { IValidators, IValidName, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  BLM_ACTIONS_BIND_CONFIGURATION,
  BLM_ACTIONS_CREATE_FILES,
  BLM_BIND_CONFIGURATION,
  BLM_CREATE_FILES,
  BLM_FOLDER_PATH,
  BLM_STORE_BIND_CONFIGURATION,
  BLM_STORE_CREATE_FILES,
  FLOW_BIND_CONFIGURATION,
  FLOW_CREATE_FILES,
  UI_ADAPTER_BIND_CONFIGURATION,
  UI_ADAPTER_CREATE_FILES,
} from './constants'
import minimist from 'minimist'
import inquirer from 'inquirer'
import { ECommands } from '../../types'
import chalk from 'chalk'

export const BlmCommandsId = Symbol('BlmCommandsId')

// Задача

@injectable()
export class BlmCommands implements IBlmCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}

  VARIANTS = {
    [EBlmVariants.action]: (list: string, blmName: string) =>
      this.createMultiple(
        list,
        'actions',
        BLM_FOLDER_PATH + '/' + blmName + '/actions',
        '.actions.ts',
        item => this.createAction(blmName, item.fileName, item.folderName),
      ),
    [EBlmVariants.store]: (list: string, blmName: string) =>
      this.createMultiple(
        list,
        'store',
        BLM_FOLDER_PATH + '/' + blmName + '/store',
        '.store.ts',
        item => this.createStore(blmName, item.fileName, item.folderName),
      ),
    [EBlmVariants.flow]: (list: string, blmName: string) =>
      this.createMultiple(
        list,
        'flow',
        BLM_FOLDER_PATH + '/' + blmName + '/flow',
        '.flow.ts',
        item => this.createFlow(blmName, item.fileName, item.folderName),
      ),
    [EBlmVariants.uiAdapter]: (list: string, blmName: string) =>
      this.createMultiple(
        list,
        'adapter',
        BLM_FOLDER_PATH + '/' + blmName + '/ui-adapters',
        '.adapter.ts',
        item => this.createUiAdapter(blmName, item.fileName, item.folderName),
      ),
  }

  // params ['blmName', '-s name?', '-f name?', '-a name', '-u name']
  async init(): Promise<void> {
    const { _: names = [''], ...params } = minimist(process.argv.slice(4))

    let blmName =
      names[0] && this.base.isInProjectExist(BLM_FOLDER_PATH + '/' + names[0])
        ? names[0]
        : ''

    if (!blmName) {
      const list = this.base.getFoldersList(BLM_FOLDER_PATH)

      blmName = await inquirer
        .prompt([
          {
            name: 'variant',
            message: 'Commands to install',
            type: 'list',
            choices: [{ name: 'New', value: '0' }, ...list],
            pageSize: Object.keys(ECommands).length + 3,
          },
        ])
        .then(res => res.variant)
    }

    // if 0 need to create
    if (blmName === '0') {
      blmName = await this.createBlm({
        name: '',
      })
    }

    const blmVariants = await this.getBlmVariants(params as any)

    await this.base.promiseOneByOne(
      Object.keys(blmVariants)
        .filter(key => !!this.VARIANTS[key as EBlmVariants])
        .map(
          key => () =>
            this.VARIANTS[key as EBlmVariants](
              (blmVariants as any)[key],
              blmName,
            ),
        ),
    )
  }

  // {[action key in EBlmVariants]: names || null}
  async getBlmVariants(data: {
    [key in keyof typeof VARIANT_OPTIONS]: string
  }): Promise<{ [key in EBlmVariants]?: string }> {
    const listsData: { [key in EBlmVariants]: string } = {
      [EBlmVariants.action]: data.a,
      [EBlmVariants.store]: data.s,
      [EBlmVariants.flow]: data.f,
      [EBlmVariants.uiAdapter]: data.u,
    }
    const params = Object.keys(data).filter(key =>
      Object.keys(VARIANT_OPTIONS).includes(key),
    )

    const isChoosed = params.some(
      key => !!data[key] && typeof data[key] === 'string',
    )

    // если хотя бы один не пустой не даем варанты, значит пользователь уже все выбрал
    if (isChoosed) {
      // which modules use
      return params.reduce((prev, currentKey) => {
        const isEmpty =
          !data[currentKey] || typeof data[currentKey] !== 'string'
        const variant = VARIANT_OPTIONS[currentKey]

        if (isEmpty) {
          return prev
        } else {
          prev[variant] = listsData[variant]

          return prev
        }
      }, {} as { [key in EBlmVariants]?: string })
    }

    return inquirer
      .prompt([
        {
          name: 'modules',
          message: '',
          type: 'checkbox',
          choices: [
            { name: 'action', value: EBlmVariants.action },
            { name: 'flow', value: EBlmVariants.flow },
            { name: 'store', value: EBlmVariants.store },
            { name: 'ui-adapter', value: EBlmVariants.uiAdapter },
          ],
        },
      ])
      .then(res =>
        res.modules.reduce(
          (prev: { [key in EBlmVariants]?: string }, current: EBlmVariants) => {
            prev[current] = ''
            return prev
          },
          {} as { [key in EBlmVariants]?: string },
        ),
      )
  }

  async createBlm({ name }: { name: string }) {
    const { fileName, folderName, folderPath } =
      await this.validators.getValidName({
        suffix: 'blm',
        name,
        folderPath: BLM_FOLDER_PATH,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFolderInProject(folderPath + '/actions')
    this.base.createFolderInProject(folderPath + '/flow')
    this.base.createFolderInProject(folderPath + '/store')
    this.base.createFolderInProject(folderPath + '/ui-adapters')

    this.base.createFilesInProject(
      BLM_CREATE_FILES({
        fileName,
        folderPath,
        folderName,
      }),
    )
    this.base.insertoIntoProjectFile(
      BLM_BIND_CONFIGURATION({
        fileName,
        folderPath,
        folderName,
      }),
    )

    return folderName
  }

  async createMultiple(
    name: string,
    suffix: string,
    folderPath: string,
    checkNameEnd: string,
    call: (data: IValidName) => void,
  ) {
    console.log(chalk.green('Create ', suffix))
    const data = await this.validators.getValidNames(
      {
        suffix,
        name: name.replaceAll(' ', ''),
        folderPath,
      },
      checkNameEnd,
    )

    data.forEach(call)
  }

  async createAction(blmName: string, name: string, actionBindName: string) {
    const folderPath = BLM_FOLDER_PATH + `/${blmName}/actions`
    const data = {
      fileName: name,
      folderPath,
      folderName: actionBindName,
    }

    this.base.createFilesInProject(BLM_ACTIONS_CREATE_FILES(data))
    this.base.insertoIntoProjectFile(BLM_ACTIONS_BIND_CONFIGURATION(data))
  }

  async createFlow(blmName: string, name: string, flowBindName: string) {
    const folderPath = BLM_FOLDER_PATH + `/${blmName}/flow`

    const data = {
      fileName: name,
      folderPath,
      folderName: flowBindName,
    }

    this.base.createFilesInProject(FLOW_CREATE_FILES(data))
    this.base.insertoIntoProjectFile(FLOW_BIND_CONFIGURATION(data, blmName))
  }

  async createStore(blmName: string, name: string, storeBindName: string) {
    const folderPath = BLM_FOLDER_PATH + `/${blmName}/store`
    const data = {
      fileName: name,
      folderPath,
      folderName: storeBindName,
    }

    this.base.createFilesInProject(BLM_STORE_CREATE_FILES(data))
    this.base.insertoIntoProjectFile(BLM_STORE_BIND_CONFIGURATION(data))
  }

  async createUiAdapter(
    blmName: string,
    name: string,
    uiAdapterBindName: string,
  ) {
    const folderPath = BLM_FOLDER_PATH + `/${blmName}/ui-adapters`

    const data = {
      fileName: name,
      folderPath,
      folderName: uiAdapterBindName,
    }

    this.base.createFilesInProject(UI_ADAPTER_CREATE_FILES(data))
    this.base.insertoIntoProjectFile(UI_ADAPTER_BIND_CONFIGURATION(data))
  }
}
