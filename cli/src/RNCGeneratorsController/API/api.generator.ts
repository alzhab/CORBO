import {
  IApiGenerator,
  IDefinition,
  IDefinitionProperty,
  IEndpoint,
  IEndpointParam,
  IMethod,
  IMethodDescParameter,
  IMethodDescSchema,
  IModule,
  IModuleProperty,
} from './types'
import { inject, injectable } from 'inversify'
import { BaseId, IBase } from '../../Base'
import fs from 'fs'
import { CONFIG_SWAGGER_PATH } from './constants'
import {
  IRepositoryCommands,
  RepositoryCommandsId,
} from '../../RNCCommandsController/Commands/RepositoryCommands'
import { MODULE_INTERFACE } from '../../../templates/Commands/RepositoriesCommands/constants'

export const ApiGeneratorId = Symbol.for('ApiGenerator')

@injectable()
export class ApiGenerator implements IApiGenerator {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(RepositoryCommandsId)
    private repositoryCommands: IRepositoryCommands,
  ) {}

  async init(): Promise<void[]> {
    // Получить Swagger
    const swagger: any = JSON.parse(
      fs.readFileSync(CONFIG_SWAGGER_PATH).toString(),
    )
    const paths: { [key: string]: IMethod } = swagger.paths
    const definitions: { [key: string]: IDefinition } = swagger.definitions
    const repos = this.getRepos(paths)
    this.generateModules(definitions)
    // Создать repositories
    return Promise.all(
      Object.keys(repos)
        .filter(
          item =>
            !this.base.isInProjectExist(
              '/src/instruments/repositories/' + item + 'Repo',
            ),
        )
        .map(repo => this.repositoryCommands.init([repo], repos[repo])),
    )
  }

  generateModules(definitions: { [key: string]: IDefinition }) {
    const definitionsContent = Object.keys(definitions)
      .map(item => MODULE_INTERFACE(this.parseModule(definitions[item], item)))
      .join('\n')

    if (this.base.isInProjectExist('/src/instruments/base')) {
      this.base.createFilesInProject([
        {
          path: '/src/instruments/repositories/types.ts',
          content: definitionsContent,
        },
      ])
    } else {
      this.base.insertoIntoProjectFile([
        {
          path: '/src/instruments/repositories/types.ts',
          type: 'end',
          text: definitionsContent,
        },
      ])
    }
  }

  parseModule(definition: IDefinition, name: string): IModule {
    return {
      name,
      description: definition.description,
      properties: Object.keys(definition.properties).map(item =>
        this.parseModuleProperty(
          definition.properties[item],
          item,
          definition.required ? definition.required.includes(item) : false,
        ),
      ),
    }
  }

  parseModuleProperty(
    property: IDefinitionProperty,
    name: string,
    required: boolean,
  ): IModuleProperty {
    return {
      name,
      type: this.getPropertyType(property),
      interface: this.getInterfaceRef(property),
      required,
    }
  }

  getPropertyType(property: IDefinitionProperty): any {
    if (property.enum) {
      return '[' + property.enum.map((item: any) => `'${item}'`).join(',') + ']'
    } else if (property.additionalProperties) {
      return Object.keys(property.additionalProperties).map(item =>
        this.parseModuleProperty(
          property.additionalProperties[item],
          item,
          false,
        ),
      )
    }

    switch (property.type) {
      case 'integer':
        return 'number'
      case 'array':
        return (
          this.getPropertyType(property.items as IDefinitionProperty) + '[]'
        )
      case 'string':
        return 'string'
      case 'boolean':
        return 'boolean'
      case 'number':
        return 'number'
      default:
        return ''
    }
  }

  getRepos(paths: { [key: string]: IMethod }): {
    [repoName: string]: IEndpoint[]
  } {
    return Object.keys(paths).reduce((acc, key) => {
      const method = paths[key]
      const methodType = this.parseEndpointMethodType(method)
      const endpoint = this.parseEndpoint(method, methodType)
      endpoint.url = this.parseEndpointUrl(key)
      const repoName = this.parseRepoNameFromMethod(method, methodType)

      if (acc[repoName]) {
        acc[repoName].push(endpoint)
      } else {
        acc[repoName] = [endpoint]
      }

      return acc
    }, {} as { [repoName: string]: IEndpoint[] })
  }

  parseEndpoint(obj: IMethod, methodType: IEndpoint['methodType']): IEndpoint {
    return {
      name: this.getFuncNameFromOperationId(obj[methodType].operationId),
      comment: obj[methodType].description,
      methodType,
      url: '',
      responseInterface: this.parseEndpointResponseInterface(obj, methodType),
      params: this.getEndpointParams(obj, methodType),
    }
  }

  parseEndpointResponseInterface(
    obj: IMethod,
    methodType: IEndpoint['methodType'],
  ) {
    const responseCode = obj[methodType].responses['200']
    return this.getInterfaceRef(
      responseCode && responseCode.schema ? responseCode.schema : { $ref: '' },
    )
  }

  getEndpointParams(
    obj: IMethod,
    methodType: IEndpoint['methodType'],
  ): {
    body?: IEndpointParam
    query: IEndpointParam[]
    path: IEndpointParam[]
  } {
    const pathParams: IEndpointParam[] = obj.parameters.map(
      this.parseEndpointParam.bind(this),
    )
    const otherParams: IEndpointParam[] = obj[methodType].parameters.map(
      this.parseEndpointParam.bind(this),
    )

    return {
      path: pathParams,
      body: otherParams.find(item => item.paramType === 'body'),
      query: otherParams.filter(item => item.paramType === 'query'),
    }
  }

  parseEndpointParam(item: IMethodDescParameter) {
    return {
      name: item.name,
      required: item.required,
      paramType: item.in,
      type: item.type,
      interface: this.getInterfaceRef(item.schema || { $ref: '' }),
    }
  }

  parseEndpointUrl(url: string) {
    return url.replace(/{/g, item => '$' + item + 'path.')
  }

  parseRepoNameFromMethod(
    obj: IMethod,
    methodType: IEndpoint['methodType'],
  ): string {
    const methodDesc = obj[methodType]
    return methodDesc && methodDesc.tags ? methodDesc.tags[0] : ''
  }

  parseEndpointMethodType(obj: IMethod): IEndpoint['methodType'] {
    return Object.keys(obj)[0] as IEndpoint['methodType']
  }

  getInterfaceRef(obj: IMethodDescSchema): string {
    return obj.$ref ? obj.$ref.replace(/#\/definitions\//, '') : ''
  }

  getFuncNameFromOperationId = (str: string) =>
    str
      .replace(/(_)(?!.*\1)(.*)/, '')
      .toLowerCase()
      .replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', ''),
      )
}
