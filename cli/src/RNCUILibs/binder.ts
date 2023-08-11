import { Container } from 'inversify'
import { IRNCUILibs } from './types'
import { RNCUILibs, RNCUILibsId } from './rnc_uilibs.controller'
import {
  IReactNativeElements,
  ReactNativeElements,
  ReactNativeElementsId,
} from './UILibs/ReactNativeElements'

export const bindUILibs = (container: Container) => {
  container.bind<IRNCUILibs>(RNCUILibsId).to(RNCUILibs)
  container
    .bind<IReactNativeElements>(ReactNativeElementsId)
    .to(ReactNativeElements)
}
