import { injectable } from 'inversify'
import { ILocalStorageClient } from './types'
import { configurePersistable } from 'mobx-persist-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const LocalStorageClientId = Symbol.for('LocalStorageClient')

@injectable()
export class LocalStorageClient implements ILocalStorageClient {
  storage = AsyncStorage

  getString(key: string) {
    return this.storage.getItem(key)
  }

  getNumber(key: string) {
    return this.storage.getItem(key).then(res => {
      if (res) {
        return +res
      }
    })
  }

  getBoolean(key: string) {
    return this.storage.getItem(key).then(res => {
      if (res) {
        return !!res
      }
    })
  }

  getObject(key: string) {
    return this.storage.getItem(key).then(res => {
      if (res) {
        return JSON.parse(res)
      }
    })
  }

  getArray(key: string) {
    return this.storage.getItem(key).then(res => {
      if (res) {
        return JSON.parse(res)
      }
    })
  }

  set(key: string, value: any) {
    switch (typeof value) {
      case 'string':
        return this.storage.setItem(key, value)
      case 'number':
        return this.storage.setItem(key, value.toString())
      case 'boolean':
        return this.storage.setItem(key, JSON.stringify(value))
      case 'object':
        if (Array.isArray(value)) {
          return this.storage.setItem(key, JSON.stringify(value))
        } else {
          return this.storage.setItem(key, JSON.stringify(value))
        }
      default:
        return this.storage.setItem(key, value)
    }
  }

  clear() {
    return this.storage.clear()
  }

  remove(key: string) {
    return this.storage.removeItem(key)
  }

  initPersistable() {
    configurePersistable({
      storage: this.storage,
    })
  }
}
