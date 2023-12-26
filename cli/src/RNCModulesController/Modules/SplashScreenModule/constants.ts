import { PROJECT_PATH } from '../../../constants'
import { IInsertoIntoProjectFileParams } from '../../../Base'

export const SPLASH_SCREEEN_TEMPLATE_PATH =
  './templates/Modules/SplashScreenModule'
export const SPLASH_SCREEN_IMAGE_PATH =
  PROJECT_PATH + '/src/Configs/SplashScreen/launch_screen.jpg'

export const SPLASH_SCREEN_ANDROID_CONFIGURATION: IInsertoIntoProjectFileParams[] =
  [
    {
      path: '/android/settings.gradle',
      text: `include ':react-native-splash-screen'
project(':react-native-splash-screen').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-splash-screen/android')`,
      type: 'end',
    },
    {
      path: '/android/app/build.gradle',
      text: "implementation project(':react-native-splash-screen')",
      type: 'after',
      searchRegex: /dependencies \{/,
    },
    {
      path: '/android/app/src/main/java/com/**/**/MainActivity.*',
      text: 'import org.devio.rn.splashscreen.SplashScreen;',
      type: 'after',
      searchRegex: new RegExp('import com.facebook.react.ReactActivity;'),
    },
    {
      path: '/android/app/src/main/java/com/**/**/MainActivity.*',
      text: '        SplashScreen.show(this);',
      type: 'after',
      searchRegex: new RegExp(
        `  protected void onCreate(Bundle savedInstanceState) {`,
      ),
    },
    {
      path: '/android/app/src/main/res/values/styles.xml',
      type: 'after',
      text: '        <item name="android:windowDisablePreview">true</item>',
      searchRegex: new RegExp(
        `    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">`,
      ),
    },
  ]

export const SPLASH_SCREEN_IOS_CONFIGURATION: IInsertoIntoProjectFileParams[] =
  [
    {
      path: '/ios/|getAppName()|/AppDelegate.mm',
      text: '#import "RNSplashScreen.h"',
      type: 'after',
      searchRegex: /#import <React\/RCTBundleURLProvider.h>/,
    },
    {
      path: '/ios/|getAppName()|/AppDelegate.mm',
      text: `  bool didFinish=[super application:application didFinishLaunchingWithOptions:launchOptions];

  [RNSplashScreen show];

  return didFinish;`,
      type: 'replace',
      searchRegex:
        /  return \[super application:application didFinishLaunchingWithOptions:launchOptions\];/,
    },
  ]

export const SPLASH_SCREEN_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/blm/root-flow/app-app-app-events.flow.ts',
    searchRegex: /import \{ autorun \} from 'mobx'/,
    text: `import Splashscreen from 'react-native-splash-screen';`,
    type: 'after',
  },
  {
    path: '/src/blm/root-flow/app-app-app-events.flow.ts',
    searchRegex: /onAppInit\(\) \{/,
    text: `    Splashscreen.hide();\n`,
    type: 'after',
  },
]
