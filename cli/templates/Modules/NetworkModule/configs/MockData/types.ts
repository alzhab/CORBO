import { AlertButton } from 'react-native'

export type TMockConfig = { [key: string]: TRoutes }

export type TRoutes = { method: Methods; responses: TResponse }

export type TResponse = { [key in Statuses]?: any }

export type Statuses =
  | 100
  | 103
  | 200
  | 201
  | 204
  | 206
  | 301
  | 302
  | 303
  | 304
  | 307
  | 308
  | 400
  | 401
  | 403
  | 404
  | 406
  | 407
  | 409
  | 410
  | 412
  | 416
  | 418
  | 425
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export enum EMethods {
  'GET' = 'onGet',
  'POST' = 'onPost',
  'PUT' = 'onPut',
  'DELETE' = 'onDelete',
  'PATCH' = 'onPatch',
}

export type TAlertButtons = (onPress: (item: Statuses) => any) => AlertButton[]
