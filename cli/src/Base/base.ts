import { injectable } from 'inversify'
import {
  IBase,
  ICheckIsExistInProjectFileParams,
  ICopyToProject,
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
  ISvgContent,
} from './types'
import chalk from 'chalk'
import shell from 'shelljs'
import { PROJECT_PATH } from '../constants'
import path from 'path'
import fs from 'fs'
import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update'

export const BaseId = Symbol.for('BaseId')

@injectable()
export class Base implements IBase {
  execAsync(cmd: string, opts = {}) {
    return new Promise(function (resolve, reject) {
      // Execute the command, reject if we exit non-zero (i.e. error)
      shell.exec(cmd, opts, function (code, stdout, stderr) {
        return resolve(stdout)
      })
    })
  }

  spinner() {
    const spinner = cliSpinners.material
    let i = 0

    const interval = setInterval(() => {
      const { frames } = spinner
      logUpdate(frames[(i = ++i % frames.length)])
    }, spinner.interval)

    return () => clearInterval(interval)
  }

  async installPods() {
    await this.execAsync('npx pod-install', { silent: true })
    await this.execAsync('watchman watch-del-all', { silent: true })
  }

  async installDependencies(libs: string[], dev?: boolean) {
    await this.execAsync(
      `npm i -s ${dev ? '--save-dev' : ''} ${libs.join(
        ' ',
      )} --legacy-peer-deps`,
    )
  }

  async syncAssets() {
    await this.execAsync('npx react-native-asset', { silent: true })
  }

  copyToProject(data: ICopyToProject[]): void {
    data.forEach(({ pathFrom, pathTo, type = 'folder' }) => {
      shell.cp(
        type === 'folder' ? '-r' : '-f',
        path.resolve(__dirname, pathFrom),
        PROJECT_PATH + pathTo,
      )
    })
  }

  updateEnv(data: { [key: string]: string }) {
    this.insertoIntoProjectFile([
      {
        content: Object.keys(data)
          .map(key => `${key}=${data[key]}`)
          .join('\n'),
        path: '/.env',
        type: 'end',
      },
      {
        path: '/src/instruments/types/env.d.ts',
        content: Object.keys(data)
          .map(key => `  export const ${key}: string`)
          .join('\n'),
        searchRegex: /declare module '@env' {/,
        type: 'after',
      },
      {
        path: '/babel.config.js',
        type: 'after',
        content: Object.keys(data)
          .map(item => `'${item}',`)
          .join('\n'),
        searchRegex: /allowlist: \[/,
      },
    ])
  }

  insertoIntoProjectFile(data: IInsertoIntoProjectFileParams[]) {
    data
      .filter(item => {
        if (item.checkExist) {
          return !this.isExistInProjectFile({
            path: item.path,
            content: item.content,
          })
        } else {
          return true
        }
      })
      .forEach(item => {
        if (/\|getAppName\(\)\|/.test(item.path)) {
          item.path = item.path.replaceAll('|getAppName()|', this.getAppName())
        }
        const searchRegexString = item.searchRegex
          ? `${item.searchRegex.toString().slice(1, -1).replaceAll('\\', '')}`
          : ''

        switch (item.type) {
          case 'end': {
            const content = shell.cat(PROJECT_PATH + item.path)
            shell
              .ShellString(content + '\n' + item.content)
              .to(PROJECT_PATH + item.path)
            break
          }
          case 'start': {
            const content = shell.cat(PROJECT_PATH + item.path)
            shell
              .ShellString(item.content + '\n' + content)
              .to(PROJECT_PATH + item.path)
            break
          }
          case 'after':
            if (item.searchRegex) {
              shell.sed(
                '-i',
                item.searchRegex,
                `${searchRegexString} \n ${item.content}`,
                PROJECT_PATH + item.path,
              )
            } else {
              console.log(
                chalk.red(
                  'ERROR: insertoIntoProjectFile must contain insertRegex',
                ),
              )
            }
            break
          case 'before':
            if (item.searchRegex) {
              shell.sed(
                '-i',
                item.searchRegex,
                `${item.content} \n ${searchRegexString}`,
                PROJECT_PATH + item.path,
              )
            } else {
              console.log(
                chalk.red(
                  'ERROR: insertoIntoProjectFile must contain insertRegex',
                ),
              )
            }
            break
          case 'replace':
            if (item.searchRegex) {
              shell.sed(
                '-i',
                item.searchRegex,
                item.content,
                PROJECT_PATH + item.path,
              )
              const data = fs.readFileSync(PROJECT_PATH + item.path)
              const result = data
                .toString()
                .replace(item.searchRegex, item.content)

              fs.writeFileSync(PROJECT_PATH + item.path, result, 'utf8')
            } else {
              console.log(
                chalk.red(
                  'ERROR: insertoIntoProjectFile must contain insertRegex',
                ),
              )
            }
            break
        }
      })
    this.lintProjectFiles(data.map(item => item.path))
  }

  isInProjectExist(path: string): boolean {
    return fs.existsSync(PROJECT_PATH + path.replace(PROJECT_PATH, ''))
  }

  getAppName() {
    const appJsonFile = fs.readFileSync(PROJECT_PATH + '/app.json')
    return JSON.parse(appJsonFile.toString()).name.replace(/\s/g, '')
  }

  createFolderInProject(path: string): void {
    shell.mkdir(PROJECT_PATH + path)
  }

  createFilesInProject(data: ICreateFileInProject[]): void {
    data.forEach(({ path, content }) => {
      shell.ShellString(content).to(PROJECT_PATH + path)
    })
  }

  async lintProjectFiles(filePaths: string[]) {
    await this.execAsync(
      `eslint --fix ${filePaths.map(item => PROJECT_PATH + item).join(' ')}`,
      {
        silent: true,
      },
    )
  }

  isFolderEmptyInProject(path: string): boolean {
    return fs.readdirSync(PROJECT_PATH + path).length === 0
  }

  toUpperCase(input?: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
  }

  getSVGContent(path: string): ISvgContent {
    const regexResults = shell.cat(PROJECT_PATH + path)

    if (regexResults) {
      const baseWidth = regexResults.match(/(?<=width=")(.*?)(?=")/)
      const baseHeight = regexResults.match(/(?<=height=")(.*?)(?=")/)
      const svg = regexResults
        .replace(/(<svg(.*)">)|<\/svg>/g, '')
        // Replace path to Path
        .replace(/(?<=<)(.*?)(?=[\s|>])|(?<=<\/)(.*?)(?=>)/g, item =>
          this.toUpperCase(item),
        )
        // Replace fill-path to fillPath
        .replace(/-(.*?)(?==)/g, input =>
          this.toUpperCase(input.replace('-', '')),
        )
        // Replace fill="white" to fill={ props.color || 'white'}
        .replace(
          /(?<=(stroke=)|(fill=))(.*?)(?= )/g,
          res => `{ props.color || ${res.replace(/"/g, "'")} }`,
        )

      const imports = svg.match(/(?<=<)(.*?)(?= )/g)

      return {
        imports: [...new Set(imports)],
        svg,
        baseHeight: baseHeight ? baseHeight[0] : '24',
        baseWidth: baseWidth ? baseWidth[0] : '24',
      }
    } else {
      console.log(chalk.red('ERROR: file ', path, ' empty'))
      shell.exit()
    }
  }

  getFoldersList(path: string): string[] {
    return fs
      .readdirSync(PROJECT_PATH + '/' + path, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

  promiseListCall<D>(
    array: Array<D> | undefined,
    call: (item?: D) => Promise<any>,
  ) {
    if (array && array[0]) {
      return Promise.all(array.map(item => call(item))).then()
    } else {
      // params = name type
      return call()
    }
  }

  async promiseOneByOne(promises: (() => Promise<any>)[]): Promise<void> {
    for (const promise of promises) {
      await promise()
    }
  }

  isExistInProjectFile(data: ICheckIsExistInProjectFileParams): boolean {
    const content = fs.readFileSync(PROJECT_PATH + data.path)

    return (
      content
        .toString()
        .replace(/\s/g, '')
        .indexOf(data.content.replace(/\s/g, '')) >= 0
    )
  }

  getNestedFolders(path: string, num = 0) {
    const arr: { path: string; folderName: string }[] = []
    // get folders list recursively
    const foldersList = this.getFoldersList(path)

    foldersList.forEach(item => {
      arr.push({ folderName: '-'.repeat(num) + item, path: path + '/' + item })
      const nested = this.getNestedFolders(path + '/' + item, num + 1)
      arr.push(...nested)
    })

    return arr
  }
}
