import { IAppIconModule } from './types'
import { inject, injectable } from 'inversify'
import path from 'path'
import sharp from 'sharp'
import chalk from 'chalk'
import shell from 'shelljs'
import { APP_ICON_PATH, APP_ICON_TEMPLATE_PATH } from './constants'
import { BaseId, IBase } from '../../../Base'

export const AppIconModuleId = Symbol.for('AppIconModule')

@injectable()
export class AppIconModule implements IAppIconModule {
  constructor(@inject(BaseId) private base: IBase) {}

  async init(): Promise<void> {
    this.generateFiles()
    await this.runAndroid(APP_ICON_PATH)
    await this.runIos(APP_ICON_PATH, this.base.getAppName())
    await this.base.installPods()
  }

  generateFiles() {
    const configFolderExist = this.base.isInProjectExist('/src/Configs/AppIcon')
    const launchIconExist = this.base.isInProjectExist(
      '/src/Configs/AppIcon/ic_launcher.png',
    )

    if (configFolderExist && !launchIconExist) {
      console.log(
        chalk.red('ERROR: /src/Configs/AppIcon/ic_launcher.png not found'),
      )
      shell.exit()
    } else if (!configFolderExist) {
      if (!this.base.isInProjectExist('/src/Configs')) {
        this.base.createFolderInProject('/src/Configs')
        this.base.createFolderInProject('/src/Configs/AppIcon')
      } else {
        this.base.createFolderInProject('/src/Configs/AppIcon')
      }

      this.base.copyToProject([
        {
          pathFrom: APP_ICON_TEMPLATE_PATH + '/AppIcon/ic_launcher.png',
          pathTo: '/src/Configs/AppIcon',
        },
      ])
    }
  }

  async runAndroid(imagePath: string) {
    const PROJECT_PATH = path.resolve(process.cwd())
    const androidResPath = PROJECT_PATH + '/android/app/src/main/res/'

    const mipmapHdpi = androidResPath + 'mipmap-hdpi/ic_launcher.png'
    const mipmapmdpi = androidResPath + 'mipmap-mdpi/ic_launcher.png'
    const mipmapXhdpi = androidResPath + 'mipmap-xhdpi/ic_launcher.png'
    const mipmapXxhdpi = androidResPath + 'mipmap-xxhdpi/ic_launcher.png'
    const mipmapXxxhdpi = androidResPath + 'mipmap-xxxhdpi/ic_launcher.png'

    const mipmapHdpiRound = androidResPath + 'mipmap-hdpi/ic_launcher_round.png'
    const mipmapmdpiRound = androidResPath + 'mipmap-mdpi/ic_launcher_round.png'
    const mipmapXhdpiRound =
      androidResPath + 'mipmap-xhdpi/ic_launcher_round.png'
    const mipmapXxhdpiRound =
      androidResPath + 'mipmap-xxhdpi/ic_launcher_round.png'
    const mipmapXxxhdpiRound =
      androidResPath + 'mipmap-xxxhdpi/ic_launcher_round.png'

    const roundedCorners = (size: number) =>
      Buffer.from(
        `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${
          size / 4
        }" ry="${size / 4}"/></svg>`,
      )

    const files = [
      {
        height: 72,
        width: 72,
        output: mipmapHdpi,
      },
      {
        height: 48,
        width: 48,
        output: mipmapmdpi,
      },
      {
        height: 96,
        width: 96,
        output: mipmapXhdpi,
      },
      {
        height: 144,
        width: 144,
        output: mipmapXxhdpi,
      },
      {
        height: 192,
        width: 192,
        output: mipmapXxxhdpi,
      },
      {
        height: 72,
        width: 72,
        output: mipmapHdpiRound,
        circle: true,
      },
      {
        height: 48,
        width: 48,
        output: mipmapmdpiRound,
        circle: true,
      },
      {
        height: 96,
        width: 96,
        output: mipmapXhdpiRound,
        circle: true,
      },
      {
        height: 144,
        width: 144,
        output: mipmapXxhdpiRound,
        circle: true,
      },
      {
        height: 192,
        width: 192,
        output: mipmapXxxhdpiRound,
        circle: true,
      },
    ]
    await Promise.all(
      files.map(({ height, circle, width, output }) =>
        sharp(imagePath)
          .resize({ height, width, fit: 'contain' })
          .composite(
            circle ? [{ input: roundedCorners(height), blend: 'dest-in' }] : [],
          )
          .toFile(output),
      ),
    )
  }

  async runIos(imagePath: string, appName: string) {
    const PROJECT_PATH = path.resolve(process.cwd())
    const launchIconImagesetPath =
      PROJECT_PATH + `/ios/${appName}/Images.xcassets/AppIcon.appiconset`

    this.base.copyToProject([
      {
        pathFrom: APP_ICON_TEMPLATE_PATH + '/Contents.json',
        pathTo: `/ios/${appName}/Images.xcassets/AppIcon.appiconset`,
        type: 'file',
      },
    ])

    const files = [
      {
        height: 29,
        width: 290,
        output: launchIconImagesetPath + '/29.png',
      },
      {
        height: 40,
        width: 400,
        output: launchIconImagesetPath + '/40.png',
      },
      {
        height: 57,
        width: 570,
        output: launchIconImagesetPath + '/57.png',
      },
      {
        height: 58,
        width: 580,
        output: launchIconImagesetPath + '/58.png',
      },
      {
        height: 60,
        width: 600,
        output: launchIconImagesetPath + '/60.png',
      },
      {
        height: 80,
        width: 800,
        output: launchIconImagesetPath + '/80.png',
      },
      {
        height: 87,
        width: 870,
        output: launchIconImagesetPath + '/87.png',
      },
      {
        height: 114,
        width: 114,
        output: launchIconImagesetPath + '/114.png',
      },
      {
        height: 120,
        width: 120,
        output: launchIconImagesetPath + '/120.png',
      },
      {
        height: 180,
        width: 180,
        output: launchIconImagesetPath + '/180.png',
      },
      {
        height: 1024,
        width: 1024,
        output: launchIconImagesetPath + '/1024.png',
      },
    ]
    await Promise.all(
      files.map(({ height, width, output }) =>
        sharp(imagePath)
          .resize({ height, width, fit: 'contain', background: 'transparent' })
          .png()
          .toFile(output),
      ),
    ).catch(err => {
      console.log({ err })
    })
  }
}
