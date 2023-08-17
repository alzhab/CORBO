import { ISplashScreenModule } from './types'
import { inject, injectable } from 'inversify'
import sharp from 'sharp'
import chalk from 'chalk'
import shell from 'shelljs'
import { PROJECT_PATH } from '../../../constants'
import {
  SPLASH_SCREEEN_TEMPLATE_PATH,
  SPLASH_SCREEN_ANDROID_CONFIGURATION,
  SPLASH_SCREEN_BIND,
  SPLASH_SCREEN_IMAGE_PATH,
  SPLASH_SCREEN_IOS_CONFIGURATION,
} from './constants'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'

export const SplashScreenModuleId = Symbol.for('SplashScreenModule')

@injectable()
export class SplashScreenModule implements ISplashScreenModule {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  async init(): Promise<void> {
    this.generateFiles()
    await this.installPackages()
    await this.runAndroidLaunchScreen(SPLASH_SCREEN_IMAGE_PATH)
    await this.runIosLaunchScreen(
      SPLASH_SCREEN_IMAGE_PATH,
      this.base.getAppName(),
    )
    await this.base.installPods()
  }
  async installPackages() {
    if (
      !this.validators.getIsDependenciesExist(['react-native-splash-screen'])
    ) {
      await this.base.installDependencies(['react-native-splash-screen'])
      this.dependencyConfiguration()
    }
  }

  dependencyConfiguration() {
    this.base.insertoIntoProjectFile(SPLASH_SCREEN_ANDROID_CONFIGURATION)
    this.base.insertoIntoProjectFile(SPLASH_SCREEN_IOS_CONFIGURATION)
    this.base.insertoIntoProjectFile(SPLASH_SCREEN_BIND)
    this.base.copyToProject([
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/res/drawable-hdpi',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/res/drawable-mdpi',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/res/drawable-xhdpi',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/res/drawable-xxhdpi',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom:
          SPLASH_SCREEEN_TEMPLATE_PATH + '/android/res/drawable-xxxhdpi',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/layout',
        pathTo: '/android/app/src/main/res',
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/android/colors.xml',
        pathTo: '/android/app/src/main/res/values',
        type: 'file',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/ios/Launchscreen.imageset',
        pathTo: `/ios/${this.base.getAppName()}/Images.xcassets`,
        type: 'folder',
      },
      {
        pathFrom: SPLASH_SCREEEN_TEMPLATE_PATH + '/ios/LaunchScreen.storyboard',
        pathTo: `/ios/${this.base.getAppName()}`,
        type: 'file',
      },
    ])
  }

  generateFiles() {
    const configSplashScreenFolderExist = this.base.isInProjectExist(
      '/src/Configs/SplashScreen',
    )
    const splashScreenFileExist = this.base.isInProjectExist(
      '/src/Configs/SplashScreen/launch_screen.jpg',
    )

    if (configSplashScreenFolderExist && !splashScreenFileExist) {
      console.log(
        chalk.red(
          'ERROR: /src/Configs/SplashScreen/launch_screen.jpg not found',
        ),
      )
      shell.exit()
    } else if (!configSplashScreenFolderExist) {
      if (!this.base.isInProjectExist('/src/Configs')) {
        this.base.createFolderInProject('/src/Configs')
        this.base.createFolderInProject('/src/Configs/SplashScreen')
      } else {
        this.base.createFolderInProject('/src/Configs/SplashScreen')
      }

      this.base.copyToProject([
        {
          pathFrom:
            SPLASH_SCREEEN_TEMPLATE_PATH + '/SplashScreen/launch_screen.jpg',
          pathTo: '/src/Configs/SplashScreen',
        },
      ])
    }
  }

  async runAndroidLaunchScreen(imagePath: string) {
    const androidResPath = PROJECT_PATH + '/android/app/src/main/res/'

    const drawableHdpi = androidResPath + 'drawable-hdpi/launch_screen.jpg'
    const drawablemdpi = androidResPath + 'drawable-mdpi/launch_screen.jpg'
    const drawableXhdpi = androidResPath + 'drawable-xhdpi/launch_screen.jpg'
    const drawableXxhdpi = androidResPath + 'drawable-xxhdpi/launch_screen.jpg'
    const drawableXxxhdpi =
      androidResPath + 'drawable-xxxhdpi/launch_screen.jpg'
    const files = [
      {
        height: 1125,
        width: 750,
        output: drawableHdpi,
      },
      {
        height: 750,
        width: 500,
        output: drawablemdpi,
      },
      {
        height: 1500,
        width: 1000,
        output: drawableXhdpi,
      },
      {
        height: 2250,
        width: 1500,
        output: drawableXxhdpi,
      },
      {
        height: 3000,
        width: 2000,
        output: drawableXxxhdpi,
      },
    ]
    await Promise.all(
      files.map(({ height, width, output }) =>
        sharp(imagePath)
          .resize({ height, width, fit: 'contain' })
          .toFile(output),
      ),
    ).catch(err => {
      console.log({ err })
    })
  }
  async runIosLaunchScreen(imagePath: string, appName: string) {
    const launchscreenImagesetPath =
      PROJECT_PATH + `/ios/${appName}/Images.xcassets/Launchscreen.imageset`

    const files = [
      {
        height: 750,
        width: 500,
        output: launchscreenImagesetPath + '/Launchscreen.jpg',
      },
      {
        height: 1500,
        width: 1000,
        output: launchscreenImagesetPath + '/Launchscreen@2x.jpg',
      },
      {
        height: 2250,
        width: 1500,
        output: launchscreenImagesetPath + '/Launchscreen@3x.jpg',
      },
    ]
    await Promise.all(
      files.map(({ height, width, output }) =>
        sharp(imagePath)
          .resize({ height, width, fit: 'contain' })
          .toFile(output),
      ),
    ).catch(err => {
      console.log({ err })
    })
  }
}
