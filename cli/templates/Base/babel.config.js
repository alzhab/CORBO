const path = require('path')
module.exports = function (e) {
  return (
    e.cache(!0),
    {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        '@babel/plugin-proposal-unicode-property-regex',
        '@babel/plugin-transform-runtime',
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: !0 }],
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: '.env',
            allowlist: [
              'SERVER_URL',
              'WEBSOCKET_URL',
              'SIZE_MATTERS_BASE_WIDTH',
              'SIZE_MATTERS_BASE_HEIGHT',
            ],
          },
        ],
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              assets: path.resolve(__dirname, './src/ui/assets'),
              icons: path.resolve(__dirname, './src/ui/assets/icons'),
              atoms: path.resolve(__dirname, './src/ui/components/atoms'),
              molecules: path.resolve(
                __dirname,
                './src/ui/components/molecules',
              ),
              organisms: path.resolve(
                __dirname,
                './src/ui/components/organisms',
              ),
              templates: path.resolve(
                __dirname,
                './src/ui/components/templates',
              ),
              screens: path.resolve(__dirname, './src/ui/screens'),
              navigations: path.resolve(__dirname, './src/ui/navigations'),
              hooks: path.resolve(__dirname, './src/instruments/hooks'),
              repositories: path.resolve(
                __dirname,
                './src/instruments/repositories',
              ),
              services: path.resolve(__dirname, './src/instruments/services'),
              types: path.resolve(__dirname, './src/instruments/types'),
              base: path.resolve(__dirname, './src/instruments/base'),
              blms: path.resolve(__dirname, './src/blms/'),
              configs: path.resolve(__dirname, './src/configs'),
            },
            extensions: [
              '.ios.js',
              '.android.js',
              '.js',
              '.jsx',
              '.json',
              '.tsx',
              '.ts',
              '.native.js',
            ],
          },
        ],
        'react-native-reanimated/plugin',
      ],
    }
  )
}
