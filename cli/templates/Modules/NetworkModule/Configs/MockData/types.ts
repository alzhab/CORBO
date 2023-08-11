export interface IMockConfig {
  method: Methods
  data: any
  api: string | RegExp
  status: Statuses
  params?: any
  errorMessage?: string
}

type Statuses =
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
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export enum EMethods {
  'GET' = 'onGet',
  'POST' = 'onPost',
  'PUT' = 'onPut',
  'DELETE' = 'onDelete',
  'PATCH' = 'onPatch',
}
