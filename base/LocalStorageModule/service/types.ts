import { AsyncStorageStatic } from '@react-native-async-storage/async-storage/lib/typescript/types'

export interface ILocalStorageClient {
  storage: AsyncStorageStatic
  getString(key: string): Promise<string | null | undefined>
  getNumber(key: string): Promise<number | null | undefined>
  getBoolean(key: string): Promise<boolean | null | undefined>
  getObject<T>(key: string): Promise<T | null>
  getArray<T>(key: string): Promise<T[] | null | undefined>
  set(key: string, value: any): Promise<void>
  clear(): Promise<void>
  remove(key: string): Promise<void>
  initPersistable(): void
}
