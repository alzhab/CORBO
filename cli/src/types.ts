export interface ITemplateProps {
  folderPath: string
  folderName: string
  fileName: string
}

export interface IIconTemplateProps {
  name: string
  imports: string[]
  svg: string
  withTheme: boolean
  baseWidth: string
  baseHeight: string
}
