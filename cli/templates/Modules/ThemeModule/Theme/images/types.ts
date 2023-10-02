import { ColorsNames } from '@corrbo/modules/theme'

export interface IImages {}

export type IImagesConfig = {
  [key in ColorsNames]: IImages
}
