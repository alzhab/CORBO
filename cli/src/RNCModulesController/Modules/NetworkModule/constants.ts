import {ICopyToProject, IInsertoIntoProjectFileParams} from '../../../Base';

export const NETWORK_MODULE_TEMPLATE_PATH = './templates/Modules/NetworkModule';

export const NETWORK_MODULE_INSERT_AXIOS: ICopyToProject[] = [
  {
    pathFrom: NETWORK_MODULE_TEMPLATE_PATH + '/Base/BaseRest',
    type: 'folder',
    pathTo: '/src/instruments/Base/BaseRest'
  },
  {
    pathFrom: NETWORK_MODULE_TEMPLATE_PATH + '/services/HttpClientService',
    type: 'folder',
    pathTo: '/src/instruments/services'
  }
];

export const NETWORK_MODULE_INSERT_MOCK: ICopyToProject[] = [
  {
    pathFrom: NETWORK_MODULE_TEMPLATE_PATH + '/services/MockAdapter',
    type: 'folder',
    pathTo: '/src/instruments/services'
  },
  {
    pathFrom: NETWORK_MODULE_TEMPLATE_PATH + '/services/MockAdapter',
    type: 'folder',
    pathTo: '/src/instruments/services'
  },
  {
    pathFrom: NETWORK_MODULE_TEMPLATE_PATH + '/configs/MockData',
    type: 'folder',
    pathTo: '/src/configs'
  }
];

export const NETWORK_MODULE_BIND_AXIOS: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/instruments/services/binder.ts',
    searchRegex: /import \{ Container \} from 'inversify'/,
    type: 'after',
    content: `import {
  HttpClient,
  HttpClientId,
  IHttpClient,
} from 'services/HttpClientService'`
  },
  {
    path: '/src/instruments/services/binder.ts',
    searchRegex: /function bindServices\(container: Container\) \{/,
    type: 'after',
    content: `container.bind<IHttpClient>(HttpClientId).to(HttpClient)`
  }
];

export const NETWORK_MODULE_BIND_MOCK: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/instruments/services/binder.ts',
    searchRegex: /import \{ Container \} from 'inversify'/,
    type: 'after',
    content: `import {
  IMockAdapter,
  MockAdapter,
  MockAdapterId,
} from './MockAdapter'`
  },
  {
    path: '/src/instruments/services/binder.ts',
    searchRegex: /function bindServices\(container: Container\) \{/,
    type: 'after',
    content: `container.bind<IMockAdapter>(MockAdapterId).to(MockAdapter)`
  },
  {
    path: '/src/instruments/services/binder.ts',
    searchRegex:
      /container.bind<IMockAdapter>\(MockAdapterId\).to\(MockAdapter\)/,
    type: 'after',
    content: `container.get<IMockAdapter>(MockAdapterId).init()`
  }
];

export const NETWORK_MODULE_DEPENDENCIES_AXIOS = [
  '@corrbo/module-network',
  'axios'
];
export const NETWORK_MODULE_DEV_DEPENDENCIES_MOCK = [
  'axios-mock-adapter',
  'mocker-data-generator'
];
