export interface IBase {
  installPods(): void
  installDependencies(libs: string[], dev?: boolean): void
  syncAssets(): void
  copyToProject(data: ICopyToProject[]): void
  updateEnv(keys: { [key: string]: string }): void
  isInProjectExist(path: string): boolean
  getAppName(): string
  insertoIntoProjectFile(data: IInsertoIntoProjectFileParams[]): void
  createFolderInProject(path: string): void
  createFilesInProject(data: ICreateFileInProject[]): void
  lintProjectFiles(): void
  isFolderEmptyInProject(path: string): boolean
  getSVGContent(path: string): ISvgContent
  spinner(): () => void
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
  text: string
  type: 'after' | 'before' | 'end' | 'start' | 'replace'
  searchRegex?: RegExp
}

export interface ISvgContent {
  imports: string[]
  svg: string
  baseWidth: string
  baseHeight: string
}
