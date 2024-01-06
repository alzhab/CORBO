import {
  IApiGenerator,
  ICreateRequestData,
  ModelType,
  Request,
  TGenericDataReturn,
} from './types'
import { inject, injectable } from 'inversify'
import { BaseId, IBase } from '../../Base'
import {
  API_FILE_PATH,
  API_GENERATOR_TEMPLATE_PATH,
  API_MODELS_FILE_PATH,
  API_PATH,
  API_TYPES_FILE_PATH,
  CONFIG_SWAGGER_PATH,
} from './constants'
import { generateApi, ParsedRoute } from 'swagger-typescript-api'
import { PROJECT_PATH } from '../../constants'
import {
  MODEL_TEMPLATE,
  REQUEST_TEMPLATE,
  REQUEST_TYPE_TEMPLATE,
} from '../../../templates/Generators/API/constants'

export const ApiGeneratorId = Symbol.for('ApiGenerator')

@injectable()
export class ApiGenerator implements IApiGenerator {
  constructor(@inject(BaseId) private base: IBase) {}

  async init(): Promise<void> {
    await generateApi({
      name: 'api.ts',
      output: PROJECT_PATH + '/src/repositories/Api',
      input: CONFIG_SWAGGER_PATH,
      templates: API_GENERATOR_TEMPLATE_PATH,
      httpClientType: 'axios',
      defaultResponseAsSuccess: false,
      generateRouteTypes: true,
      generateResponses: true,
      extractRequestParams: true,
      extractRequestBody: true,
      extractResponseBody: true,
      extractResponseError: true,
      extractEnums: true,
      prettier: {},
      typePrefix: 'I',
      enumKeyPrefix: '',
      enumKeySuffix: '',
      silent: true,
      extractingOptions: {
        requestBodySuffix: ['Payload', 'Body', 'Input'],
        requestParamsSuffix: ['Params'],
        responseBodySuffix: ['Data', 'Result', 'Output'],
        responseErrorSuffix: [
          'Error',
          'Fail',
          'Fails',
          'ErrorData',
          'HttpError',
          'BadResponse',
        ],
      },
    })
      .then(({ configuration }) => {
        const { routesData, requestsTemplate, requestsTypeTemplate } =
          this.parseRoutesData(configuration.routes.combined)

        const { modelTypesTemplate, importTemplate } = this.getModelsTemplate(
          routesData,
          configuration.modelTypes as any,
        )

        this.generateFiles({
          requestsTemplate,
          requestsTypeTemplate,
          modelTypesTemplate,
          importTemplate,
        })
      })
      .catch(e => {
        console.log({ e })
      })
  }

  generateFiles(data: {
    requestsTemplate: string
    requestsTypeTemplate: string
    modelTypesTemplate: string
    importTemplate: string
  }) {
    if (!this.base.isInProjectExist(API_PATH)) {
      // TODO Create Api structure from network module
      this.base.createFolderInProject(API_PATH)
    }

    if (this.base.isInProjectExist(API_MODELS_FILE_PATH)) {
      this.base.insertoIntoProjectFile([
        {
          path: API_MODELS_FILE_PATH,
          type: 'end',
          content: data.modelTypesTemplate,
        },
      ])
    } else {
      this.base.createFilesInProject([
        {
          path: API_MODELS_FILE_PATH,
          content: data.modelTypesTemplate,
        },
      ])
    }

    this.base.insertoIntoProjectFile([
      {
        path: API_TYPES_FILE_PATH,
        type: 'before',
        content: `, ContentType, TRequestData`,
        searchRegex: new RegExp(/} from 'base\/BaseRest'/),
      },
      {
        path: API_TYPES_FILE_PATH,
        type: 'start',
        content: `import {${data.importTemplate}} from './models'
import {ContentType, TRequest, TRequestData} from 'base/BaseRest'
`,
      },
      {
        path: API_TYPES_FILE_PATH,
        type: 'after',
        searchRegex: new RegExp(/export interface IApiRepo \{/),
        content: data.requestsTypeTemplate,
      },
    ])

    this.base.insertoIntoProjectFile([
      {
        path: API_FILE_PATH,
        type: 'start',
        content: `import {${data.importTemplate} from './models'
import {ContentType, TRequestData} from 'base/BaseRest';
import {AxiosResponse} from 'axios';
`,
      },
      {
        path: API_FILE_PATH,
        type: 'after',
        searchRegex: new RegExp(
          /export class ApiRepo extends BaseRest implements IApiRepo \{/,
        ),
        content: data.requestsTemplate,
      },
    ])
  }

  getModelsTemplate(
    routesData: ICreateRequestData[],
    configModelTypes: ModelType[],
  ) {
    const routesModelTypes = this.getRoutesModelTypes(routesData)

    configModelTypes = configModelTypes.filter((value, index, self) => {
      return self.findIndex(v => v.name === value.name) === index
    })

    const modelTypes = [...configModelTypes, ...routesModelTypes]

    const importTemplate = modelTypes.map(item => item.name).join(', ')

    const modelTypesTemplate = modelTypes.map(this.getCreateModelData).join('')

    return {
      importTemplate,
      modelTypesTemplate,
    }
  }

  parseRoutesData(
    data?: {
      moduleName: string
      routes: ParsedRoute[]
    }[],
  ) {
    const routesData: ICreateRequestData[] = (data || []).reduce(
      (prev: any, current) => {
        const routesData = current.routes.map(({ request }) =>
          this.getCreateRequestData(request as any),
        )

        prev.push(...routesData)

        return prev
      },
      [] as ICreateRequestData[],
    )

    const requestsTemplate = routesData
      .map(item => item.requestTemplate)
      .join('\n')
    const requestsTypeTemplate = routesData
      .map(item => item.requestTypeTemplate)
      .join('\n')

    return { routesData, requestsTemplate, requestsTypeTemplate }
  }

  getRoutesModelTypes(data: ICreateRequestData[]) {
    return data.reduce((prev, { body, query, response }) => {
      const bodyModelType: ModelType | null = body.isCreateType
        ? {
            name: body.interfaceName,
            typeData: { content: body.interfaceContent },
            typeIdentifier: body.typeIdentifier,
          }
        : null

      if (
        bodyModelType &&
        !prev.find(item => item.name === body.interfaceName)
      ) {
        prev.push(bodyModelType)
      }

      const queryModelType: ModelType | null = query.isCreateType
        ? {
            name: query.interfaceName,
            typeData: { content: query.interfaceContent },
            typeIdentifier: query.typeIdentifier,
          }
        : null

      if (
        queryModelType &&
        !prev.find(item => item.name === query.interfaceName)
      ) {
        prev.push(queryModelType)
      }

      const responseModelType: ModelType | null = response.isCreateType
        ? {
            name: response.interfaceName,
            typeData: { content: response.interfaceContent },
            typeIdentifier: response.typeIdentifier,
          }
        : null

      if (
        responseModelType &&
        !prev.find(item => item.name === response.interfaceName)
      ) {
        prev.push(responseModelType)
      }

      return prev
    }, [] as ModelType[])
  }

  getCreateModelData(model: ModelType) {
    return MODEL_TEMPLATE({
      name: model.name,
      content: model.typeData.content,
      type: model.typeIdentifier,
    })
  }

  getCreateRequestData(request: Request): ICreateRequestData {
    const functionName = this.getRequestName(request)

    const requestPath = this.getRequestPath(request)

    const {
      data: requestDataGenerics,
      body,
      query,
      type,
      response,
    } = this.getRequestDataGenerics(request, functionName)

    const requestTemplate = REQUEST_TEMPLATE({
      functionName,
      path: requestPath,
      method: request.method,
      response: response.interfaceName,
      requestDataGeneric: requestDataGenerics,
    })

    const requestTypeTemplate = REQUEST_TYPE_TEMPLATE({
      functionName,
      response: response.interfaceName,
      requestDataGeneric: requestDataGenerics,
    })

    return {
      body,
      query,
      type,
      requestTemplate,
      requestTypeTemplate,
      response,
    }
  }

  toUppercase(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }

  getRequestRepsonse(functionName: string): TGenericDataReturn {
    return {
      interfaceName: `I${this.toUppercase(functionName)}Response`,
      isCreateType: true,
      interfaceContent: 'void',
      typeIdentifier: 'type',
    }
  }

  getRequestBody(request: Request, functionName: string): TGenericDataReturn {
    const params =
      request.payload && ['body', 'data'].includes(request.payload.name)
        ? request.payload.type.replace(/\(|\)/g, '')
        : ''

    if (!params) {
      return {
        interfaceName: ``,
        interfaceContent: '',
        isCreateType: false,
        typeIdentifier: 'interface',
      }
    } else if (params[0] === '{') {
      return {
        interfaceName: `I${this.toUppercase(functionName)}Body`,
        interfaceContent: params,
        isCreateType: true,
        typeIdentifier: 'interface',
      }
    } else {
      return {
        interfaceName: params,
        interfaceContent: '',
        isCreateType: false,
        typeIdentifier: 'interface',
      }
    }
  }

  getRequestParams(request: Request, functionName: string): TGenericDataReturn {
    const params = request.pathParams ? request.pathParams.type : ''

    if (!params) {
      return {
        interfaceName: ``,
        interfaceContent: '',
        isCreateType: false,
        typeIdentifier: 'interface',
      }
    } else if (params[0] === '{') {
      return {
        interfaceName: `I${this.toUppercase(functionName)}Params`,
        interfaceContent: params,
        isCreateType: true,
        typeIdentifier: 'interface',
      }
    } else {
      return {
        interfaceName: params,
        interfaceContent: '',
        isCreateType: false,
        typeIdentifier: 'interface',
      }
    }
  }

  getRequestDataGenerics(request: Request, functionName: string) {
    const body = this.getRequestBody(request, functionName)
    const query = this.getRequestParams(request, functionName)
    const type = request.formData ? 'ContentType.FormData' : ''
    const response = this.getRequestRepsonse(functionName)

    const data = [
      body.interfaceName || (query.interfaceName || type ? '{}' : ''),
      query.interfaceName || (type ? '{}' : ''),
      type || '',
    ]
      .filter(item => !!item)
      .join(',')

    return {
      data,
      body,
      query,
      type,
      response,
    }
  }

  getRequestPath(request: Request) {
    return `${'`'}${request.path.replace(
      /(?<=\${)(.*)(?=})/g,
      group => 'data?.query?.' + group,
    )}${'`'}`
  }

  getRequestName(request: Request) {
    const methodAliases: any = {
      get: (pathName: string) =>
        `${pathName}${request.pathParams ? 'List' : 'Detail'}`,
      post: (pathName: string) =>
        `${pathName}Create${request.pathParams ? 'ByParam' : ''}`,
      put: (pathName: string) =>
        `${pathName}Update${request.pathParams ? 'ByParam' : ''}`,
      patch: (pathName: string) =>
        `${pathName}PartialUpdate${request.pathParams ? 'ByParam' : ''}`,
      delete: (pathName: string) =>
        `${pathName}Delete${request.pathParams ? 'ByParam' : ''}`,
    }

    const path =
      request.path[0] === '/' ? request.path.replace('/', '') : request.path
    const name = path
      .replace(/(\/?[${](.*)}\/?)/g, '/')
      .replace(/([-_/][a-z])/g, group =>
        group.toUpperCase().replace(/-|_|\//g, ''),
      )
      .replaceAll('/', '')

    return methodAliases[request.method](name)
  }
}
