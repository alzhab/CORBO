export interface IBase {
  installPods(): Promise<void>

  installDependencies(libs: string[], dev?: boolean): Promise<void>

  syncAssets(): Promise<void>

  copyToProject(data: ICopyToProject[]): void

  updateEnv(keys: { [key: string]: string }): void

  isInProjectExist(path: string): boolean

  getAppName(): string

  insertoIntoProjectFile(data: IInsertoIntoProjectFileParams[]): void

  createFolderInProject(path: string): void

  createFilesInProject(data: ICreateFileInProject[]): void

  lintProjectFiles(filePaths: string[]): Promise<void>

  isFolderEmptyInProject(path: string): boolean

  getSVGContent(path: string): ISvgContent

  spinner(): () => void

  getFoldersList(path: string): string[]

  promiseListCall<D>(
    names: Array<D>,
    call: (item?: D) => Promise<any>,
  ): Promise<void>

  promiseOneByOne(pomises: (() => Promise<any>)[]): Promise<void>

  isExistInProjectFile(data: ICheckIsExistInProjectFileParams): boolean

  execAsync(cmd: string, opts?: any): Promise<any>

  getNestedFolders(
    path: string,
    num?: number,
  ): { path: string; folderName: string }[]
}

export interface ICopyToProject {
  pathFrom: string
  pathTo: string
  type?: 'folder' | 'file'
}

export interface ICreateFileInProject {
  path: string
  content: string
}

export interface IInsertoIntoProjectFileParams {
  path: string
  content: string
  type: 'after' | 'before' | 'end' | 'start' | 'replace'
  searchRegex?: RegExp
  checkExist?: boolean
  scopeStart?: RegExp
}

export interface ISvgContent {
  imports: string[]
  svg: string
  baseWidth: string
  baseHeight: string
}

export interface ICheckIsExistInProjectFileParams {
  path: string
  content: string
}
