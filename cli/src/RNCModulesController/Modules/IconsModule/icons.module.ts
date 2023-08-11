import { IIconsModule } from './types'
import { inject, injectable } from 'inversify'
import {
  ISpacingPropsModule,
  SpacingPropsModuleId,
} from '../SpacingPropsModule'
import { IValidators, ValidatorsId } from '../../../Validators'
import chalk from 'chalk'
import shell from 'shelljs'
import { BaseId, IBase, ICreateFileInProject } from '../../../Base'
import {
  ICONS_MODULE_DEPENDENCIES,
  ICONS_MODULE_IMPORT_PATH,
  ICONS_MODULE_PATH,
} from './constants'
import { PROJECT_PATH } from '../../../constants'
import { ICON_COMPONENT_FILE_TEMPLATE } from '../../../../templates/Modules/IconsModule/constants'

export const IconsModuleId = Symbol.for('IconsModuleId')

@injectable()
export class IconsModule implements IIconsModule {
  constructor(
    @inject(SpacingPropsModuleId)
    private spacingPropsModule: ISpacingPropsModule,
    @inject(ValidatorsId)
    private validators: IValidators,
    @inject(BaseId)
    private base: IBase,
  ) {}
  async init(): Promise<void> {
    await this.checkIsIconsModuleValid()

    await this.spacingPropsModule.checkInstall()

    if (!this.validators.getIsDependenciesExist(ICONS_MODULE_DEPENDENCIES)) {
      this.base.installDependencies(ICONS_MODULE_DEPENDENCIES)
    }

    const files = shell
      .ls(PROJECT_PATH + ICONS_MODULE_IMPORT_PATH)
      .filter(file => file.includes('.svg'))
    const createFiles: ICreateFileInProject[] = files
      .map(path => this.generateIcon(path))
      .filter(item => item !== null) as ICreateFileInProject[]

    await this.base.createFilesInProject(createFiles)
  }

  checkIsIconsModuleValid() {
    const iconsFolderNotExist = !this.base.isInProjectExist(
      '/src/UI/assets/icons',
    )

    if (iconsFolderNotExist) {
      console.log(chalk.red('ERROR: src/UI/assets/icons empty'))
      this.base.createFolderInProject('/src/UI/assets/icons')
      this.base.createFolderInProject(ICONS_MODULE_IMPORT_PATH)
    }

    const importFolderNotExist = !this.base.isInProjectExist(
      ICONS_MODULE_IMPORT_PATH,
    )

    if (importFolderNotExist) {
      console.log(chalk.red('ERROR: ', ICONS_MODULE_IMPORT_PATH))
      this.base.createFolderInProject(ICONS_MODULE_IMPORT_PATH)
    }

    const importFolderEmpty = this.base.isFolderEmptyInProject(
      '/src/UI/assets/icons/import',
    )

    if (importFolderEmpty) {
      console.log(chalk.red('ERROR: src/UI/assets/icons/import folder empty'))
    }
  }

  generateIcon(fileName: string): ICreateFileInProject | null {
    const path = ICONS_MODULE_IMPORT_PATH + '/' + fileName
    const name = this.validators.getValidIconName(fileName)

    if (!this.base.isInProjectExist(ICONS_MODULE_PATH + '/' + name + '.tsx')) {
      const { imports, svg, baseHeight, baseWidth } =
        this.base.getSVGContent(path)

      return {
        path: ICONS_MODULE_PATH + '/' + name + '.tsx',
        content: ICON_COMPONENT_FILE_TEMPLATE({
          name,
          imports,
          svg,
          withTheme: this.validators.isThemeModuleInitialized,
          baseHeight,
          baseWidth,
        }),
      }
    } else {
      console.log(chalk.red('ERROR: icon ', name, ' already exist'))
      return null
    }
  }
}
