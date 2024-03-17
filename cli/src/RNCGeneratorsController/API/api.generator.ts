import {
  IApiGenerator,
  ICreateRequestData,
  IRequestMockTemplateConfig,
  ModelType,
  Request,
  Response,
  TGenericDataReturn,
} from './types'
import { inject, injectable } from 'inversify'
import { BaseId, IBase, IInsertoIntoProjectFileParams } from '../../Base'
import {
  API_FILE_PATH,
  API_GENERATOR_TEMPLATE_PATH,
  API_MODELS_FILE_PATH,
  API_TYPES_FILE_PATH,
  CONFIG_SWAGGER_PATH,
  MOCK_CONFIG_FILE_PATH,
} from './constants'
import { generateApi, ParsedRoute } from 'swagger-typescript-api'
import { PROJECT_PATH } from '../../constants'
import {
  MOCK_CONFIG_RESPONSE_TEMPLATE,
  MOCK_CONFIG_ROUTE_TEMPLATE,
  MODEL_TEMPLATE,
  REQUEST_TEMPLATE,
  REQUEST_TYPE_TEMPLATE,
} from './templates'
import { TCommandReturn } from '../../types'

export const ApiGeneratorId = Symbol.for('ApiGenerator')

@injectable()
export class ApiGenerator implements IApiGenerator {
  constructor(@inject(BaseId) private base: IBase) {}

  async init(): Promise<TCommandReturn> {
    return generateApi({
      name: 'api.ts',
      output: PROJECT_PATH + '/src/instruments/repositories/Api',
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
    }).then(({ configuration }) => {
      const {
        routesData,
        requestsTemplate,
        requestsTypeTemplate,
        requestsMockTemplates,
      } = this.parseRoutesData(configuration.routes.combined)

      const { modelTypesTemplate, importTemplate } = this.getModelsTemplate(
        routesData,
        configuration.modelTypes as any,
      )

      this.generateFiles({
        requestsTemplate,
        requestsTypeTemplate,
        requestsMockTemplates,
        modelTypesTemplate,
        importTemplate,
      })
    })
  }

  generateFiles(data: {
    requestsTemplate: string
    requestsTypeTemplate: string
    requestsMockTemplates: IRequestMockTemplateConfig[]
    modelTypesTemplate: string
    importTemplate: string
  }): TCommandReturn {
    // TODO Create Api structure from network module
    const modelsImport: (
      path: string,
    ) => Omit<IInsertoIntoProjectFileParams, 'path'> = path =>
      this.base.isExistInProjectFile({
        path,
        content: './models',
      })
        ? {
            type: 'before',
            searchRegex: new RegExp(/} from '\.\/models'/),
            content: `${data.importTemplate}`,
          }
        : {
            type: 'start',
            content: `import {${data.importTemplate}} from './models'`,
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
        searchRegex: new RegExp(/} from 'base\/BaseRest'/),
        content: `, ContentType`,
        checkExist: true,
      },
      {
        path: API_TYPES_FILE_PATH,
        ...modelsImport(API_TYPES_FILE_PATH),
      },
      {
        path: API_TYPES_FILE_PATH,
        type: 'after',
        searchRegex: new RegExp(/export interface IApiRepo \{/),
        content: data.requestsTypeTemplate,
        checkExist: true,
      },
    ])

    this.base.insertoIntoProjectFile([
      {
        path: API_FILE_PATH,
        ...modelsImport(API_FILE_PATH),
      },
      {
        path: API_FILE_PATH,
        type: 'after',
        searchRegex: new RegExp(/import \{ BaseRest/),
        content: `, ContentType`,
        checkExist: true,
      },
      {
        path: API_FILE_PATH,
        type: 'after',
        searchRegex: new RegExp(/import \{ BaseRest/),
        content: `, TRequestData`,
        checkExist: true,
      },
      {
        path: API_FILE_PATH,
        type: 'start',
        content: `import { AxiosResponse } from 'axios'`,
        checkExist: true,
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

    const mockInsertConfig: IInsertoIntoProjectFileParams[] =
      data.requestsMockTemplates.map(item => {
        return item.routeTemplate
          ? {
              path: MOCK_CONFIG_FILE_PATH,
              type: 'after',
              searchRegex: new RegExp(/TMockConfig = \{/),
              content: item.routeTemplate,
            }
          : {
              path: MOCK_CONFIG_FILE_PATH,
              type: 'after',
              searchRegex: new RegExp(
                item.path +
                  '.*?' +
                  item.responsesTemplate +
                  '.*?responses\\s*:\\s*{',
              ),
              content: item.responsesTemplate.content,
            }
      })

    this.base.insertoIntoProjectFile(mockInsertConfig)
  }

  getModelsTemplate(
    routesData: ICreateRequestData[],
    configModelTypes: ModelType[],
  ) {
    const routesModelTypes = this.getRoutesModelTypes(routesData)

    configModelTypes = configModelTypes.filter((value, index, self) => {
      const notAlredyExistInFile = !this.base.isExistInProjectFile({
        path: API_MODELS_FILE_PATH,
        content: value.name,
      })

      const isNotDuplicate =
        self.findIndex(v => v.name === value.name) === index

      return notAlredyExistInFile && isNotDuplicate
    })

    const modelTypes = [...configModelTypes, ...routesModelTypes]

    const importTemplate = modelTypes
      .filter((value, index, self) => {
        const notAlreadyExistInFile = !this.base.isExistInProjectFile({
          path: API_FILE_PATH,
          content: value.name,
        })
        const isNotDuplicate =
          self.findIndex(v => v.name === value.name) === index

        return notAlreadyExistInFile && isNotDuplicate
      })
      .map(item => item.name)
      .join(', ')

    const modelTypesTemplate = modelTypes
      .filter((value, index, self) => {
        const notAlreadyExistInFile = !this.base.isExistInProjectFile({
          path: API_MODELS_FILE_PATH,
          content: value.name,
        })
        const isNotDuplicate =
          self.findIndex(v => v.name === value.name) === index

        return notAlreadyExistInFile && isNotDuplicate
      })
      .map(this.getCreateModelData)
      .join('')

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
        const routesData = current.routes.map(
          ({ request, responseBodyInfo: { responses } }: any) =>
            this.getCreateRequestData(request as any, (responses || []) as any),
        )

        prev.push(...routesData)

        return prev
      },
      [] as ICreateRequestData[],
    )

    const requestTemplateRoutesData = routesData.filter(item => {
      const isExist = this.base.isExistInProjectFile({
        path: API_FILE_PATH,
        content: item.functionName,
      })

      return !isExist
    })

    const mockRequestTemplateRoutesData = routesData

    const requestsTemplate = requestTemplateRoutesData
      .map(item => item.requestTemplate)
      .join('\n')
    const requestsTypeTemplate = requestTemplateRoutesData
      .map(item => item.requestTypeTemplate)
      .join('\n')
    const requestsMockTemplates = mockRequestTemplateRoutesData.map(
      item => item.requestMockTemplates,
    )

    return {
      routesData,
      requestsTemplate,
      requestsTypeTemplate,
      requestsMockTemplates,
    }
  }

  getRoutesModelTypes(data: ICreateRequestData[]) {
    return data.reduce((prev, { body, query, requestResponse }) => {
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

      prev.push({
        name: requestResponse.interfaceName,
        typeData: { content: requestResponse.interfaceContent },
        typeIdentifier: requestResponse.typeIdentifier,
      })

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

  getCreateRequestData(
    request: Request,
    responses: Response[],
  ): ICreateRequestData {
    const functionName = this.getRequestName(request)

    const requestPath = this.getRequestPath(request)

    const {
      data: requestDataGenerics,
      body,
      query,
      type,
      requestResponse,
    } = this.getRequestDataGenerics(request, responses, functionName)

    const requestTemplate = REQUEST_TEMPLATE({
      functionName,
      path: requestPath,
      method: request.method,
      response: requestResponse.interfaceName,
      requestDataGeneric: requestDataGenerics,
    })

    const requestTypeTemplate = REQUEST_TYPE_TEMPLATE({
      functionName,
      response: requestResponse.interfaceName,
      requestDataGeneric: requestDataGenerics,
    })

    const isMockRouteExist = this.base.isExistInProjectFile({
      path: MOCK_CONFIG_FILE_PATH,
      content: request.path,
    })

    const requestMockTemplates = {
      path: request.path,
      routeTemplate: isMockRouteExist
        ? ''
        : MOCK_CONFIG_ROUTE_TEMPLATE({
            path: request.path,
            response: { data: '', status: 200 },
            method: request.method,
          }),
      responsesTemplate: {
        method: request.method,
        content: MOCK_CONFIG_RESPONSE_TEMPLATE({
          response: { data: '', status: 200 },
        }),
      },
    }

    return {
      functionName,
      path: requestPath,
      body,
      query,
      type,
      requestTemplate,
      requestTypeTemplate,
      requestResponse,
      requestMockTemplates,
    }
  }

  toUppercase(input: string) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }

  getRequestRepsonses(
    responses: Response[],
    functionName: string,
  ): TGenericDataReturn {
    return {
      interfaceName: `I${this.toUppercase(functionName)}Response${200}`,
      interfaceContent: 'void',
      isCreateType: true,
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

  getRequestDataGenerics(
    request: Request,
    responses: Response[],
    functionName: string,
  ) {
    const body = this.getRequestBody(request, functionName)
    const query = this.getRequestParams(request, functionName)
    const type = request.formData ? 'ContentType.FormData' : ''
    const requestResponse = this.getRequestRepsonses(responses, functionName)

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
      requestResponse,
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
