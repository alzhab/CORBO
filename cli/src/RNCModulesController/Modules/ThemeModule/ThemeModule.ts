import { IThemeModule } from './types'
import { inject, injectable } from 'inversify'
import { BaseId, IBase } from '../../../Base'
import { THEME_BIND, THEME_COPY, THEME_DEPENDENCIES } from './constants'

export const ThemeModuleId = Symbol.for('ThemeModuleId')

@injectable()
export class ThemeModule implements IThemeModule {
  constructor(@inject(BaseId) private base: IBase) {}

  async init(): Promise<void> {
    this.generateFiles()

    await this.base.installDependencies(THEME_DEPENDENCIES)

    this.base.insertoIntoProjectFile(THEME_BIND)

    await this.base.syncAssets()

    await this.base.installPods()
  }

  generateFiles() {
    this.base.copyToProject(THEME_COPY)

    this.base.updateEnv({
      SIZE_MATTERS_BASE_WIDTH: '390',
      SIZE_MATTERS_BASE_HEIGHT: '844',
    })
  }
}
