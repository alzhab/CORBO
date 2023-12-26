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
            // ui
            assets: path.resolve(__dirname, './src/ui/assets'),
            icons: path.resolve(__dirname, './src/ui/assets/icons'),
            atoms: path.resolve(__dirname, './src/ui/components/atoms'),
            molecules: path.resolve(__dirname, './src/ui/components/molecules'),
            organisms: path.resolve(__dirname, './src/ui/components/organisms'),
            templates: path.resolve(__dirname, './src/ui/components/templates'),
            screens: path.resolve(__dirname, './src/ui/screens'),
            navigations: path.resolve(__dirname, './src/ui/navigations'),
            // instruments
            hooks: path.resolve(__dirname, './src/instruments/hooks'),
            repositories: path.resolve(
              __dirname,
              './src/instruments/repositories',
            ),
            services: path.resolve(__dirname, './src/instruments/services'),
						types: path.resolve(__dirname, './src/instruments/types'),
						base: path.resolve(__dirname, './src/instruments/base'),
            // Business Logic
            blms: path.resolve(__dirname, './src/blm/blm'),
            flow: path.resolve(__dirname, './src/blm/root-flow'),
            stores: path.resolve(__dirname, './src/blm/stores'),
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
