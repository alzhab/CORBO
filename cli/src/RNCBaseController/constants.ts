import { ICopyToProject, IInsertoIntoProjectFileParams } from '../Base'

export const RNCBASE_TEMPLATE_PATH = './templates/RNCBaseController'

export const RNCBASE_DEPENDENCIES = [
  '@corrbo/base',
  '@react-native-async-storage/async-storage',
  '@react-navigation/native',
  '@react-navigation/stack',
  'inversify',
  'inversify-react',
  'mobx',
  'mobx-persist-store',
  'mobx-react',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-svg',
  'reflect-metadata',
]
export const RNCBASE_DEV_DEPENDENCIES = [
  '@babel/plugin-proposal-unicode-property-regex',
  '@babel/plugin-proposal-decorators',
  '@babel/plugin-transform-runtime',
  '@babel/preset-env',
  '@babel/preset-typescript',
  '@babel/runtime',
  '@tsconfig/react-native',
  '@types/jest',
  '@types/react',
  '@types/react-native',
  '@types/react-native-dotenv',
  '@types/react-test-renderer',
  '@typescript-eslint/parser',
  'axios-mock-adapter',
  'babel-jest',
  'babel-loader',
  'babel-plugin-module-resolver',
  'babel-plugin-transform-typescript-metadata',
  'eslint',
  'jest',
  'metro-react-native-babel-preset',
  'mocker-data-generator',
  'prettier',
  'react-native-dotenv',
  'react-test-renderer',
  'typescript',
]
export const TEMPLATE_PATHES: ICopyToProject[] = [
  '/src',
  '/babel.config.js',
  '/App.tsx',
  '/tsconfig.json',
  '/.eslintrc.js',
  '/index.js',
  '/.env',
  '/.prettierrc.js',
].map(item => ({
  pathFrom: RNCBASE_TEMPLATE_PATH + item,
  pathTo: '/',
  type: item === '/src' ? 'folder' : 'file',
}))

export const NAVIGATION_CONFIGURATION: IInsertoIntoProjectFileParams[] = [
  {
    path: '/android/app/src/main/java/com/**/**/MainActivity.*',
    text: 'import android.os.Bundle;',
    type: 'before',
    searchRegex: new RegExp('import com.facebook.react.ReactActivity;'),
  },
  {
    path: '/android/app/src/main/java/com/**/**/MainActivity.*',
    text: `  /**
   * React navigation additional configuration step to properly work on Android devices
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }`,
    type: 'after',
    searchRegex: new RegExp(
      'public class MainActivity extends ReactActivity {',
    ),
  },
]
