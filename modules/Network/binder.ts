import { Container } from 'inversify'
import {
  HttpClient,
  HttpClientId,
  IHttpClient,
  IMockAdapter,
  MockAdapter,
  MockAdapterId,
} from './services'

export const bindNetworkModule = (container: Container) => {
  container.bind<IHttpClient>(HttpClientId).to(HttpClient)
  container.bind<IMockAdapter>(MockAdapterId).to(MockAdapter)
  container.get<IMockAdapter>(MockAdapterId).init()
}
