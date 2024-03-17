import {ColorsNames} from '@corrbo/module-theme';

export interface IImages {
}

export type IImagesConfig = {
  [key in ColorsNames]: IImages
}
