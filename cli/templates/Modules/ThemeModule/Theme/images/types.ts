import { ColorsNames } from '@alzhan/rncore-theme-module'

export interface IImages {}

export type IImagesConfig = {
  [key in ColorsNames]: IImages
}
