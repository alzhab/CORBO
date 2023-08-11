export interface INetworkModule {
  init(): Promise<void>
  installMockModule(): Promise<void>
}

export enum ENetworkType {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GraphQL',
  GRPC = 'gRPC',
}
