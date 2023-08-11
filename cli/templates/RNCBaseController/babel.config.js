const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@babel/plugin-proposal-unicode-property-regex',
      '@babel/plugin-transform-runtime',
      'babel-plugin-transform-typescript-metadata',
      ['@babel/plugin-proposal-decorators', {legacy: true}],
			[
				'module:react-native-dotenv',
				{
					moduleName: '@env',
					path: '.env',
					allowlist: [],
				},
			],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            // UI
            assets: path.resolve(__dirname, './src/UI/assets'),
            icons: path.resolve(__dirname, './src/UI/assets/icons'),
            atoms: path.resolve(__dirname, './src/UI/components/atoms'),
            molecules: path.resolve(__dirname, './src/UI/components/molecules'),
            organisms: path.resolve(__dirname, './src/UI/components/organisms'),
            templates: path.resolve(__dirname, './src/UI/components/templates'),
            screens: path.resolve(__dirname, './src/UI/screens'),
            navigations: path.resolve(__dirname, './src/UI/navigations'),
            // Instruments
            hooks: path.resolve(__dirname, './src/Instruments/hooks'),
            repositories: path.resolve(
              __dirname,
              './src/Instruments/repositories',
            ),
            services: path.resolve(__dirname, './src/Instruments/services'),
						types: path.resolve(__dirname, './src/Instruments/types'),
						base: path.resolve(__dirname, './src/Instruments/base'),
            // Business Logic
            blms: path.resolve(__dirname, './src/BusinessLogic/blms'),
            flow: path.resolve(__dirname, './src/BusinessLogic/flow'),
            stores: path.resolve(__dirname, './src/BusinessLogic/stores'),
            // Configs
            configs: path.resolve(__dirname, './src/Configs'),
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
  };
};
