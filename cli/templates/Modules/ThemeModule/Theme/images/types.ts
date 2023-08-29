import { ColorsNames } from '@corbo/modules/theme'

export interface IImages {}

export type IImagesConfig = {
  [key in ColorsNames]: IImages
}
