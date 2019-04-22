const path = require('path');

module.exports = {
  title: 'react-hifi',
  components: 'src/**/*.tsx',
  ignore: [
    'src/**/helpers/**/*.tsx',
    'src/**/plugins/_lib/*.tsx',
    'src/**/*.test.tsx'
  ],
  styleguideDir: 'docs',
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse,
  sections: [
    {
      name: 'Introduction',
      content: 'src/README.md'
    },
    {
      name: 'Styleguide',
      components: 'src/Sound/**/*.tsx',
      exampleMode: 'expand',
      usageMode: 'expand'
    },
    {
      name: 'Plugins',
      content: 'src/plugins/README.md',
      components: 'src/plugins/**/*.tsx',
      exampleMode: 'collapse',
      usageMode: 'collapse'
    },
    {
      name: 'Full Example',
      content: 'src/Summary.md',
      exampleMode: 'collapse',
      usageMode: 'collapse'
    }
  ],
  webpackConfig: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: ['node_modules'],
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/index.ts'),
        sound: path.resolve(__dirname, 'src/Sound/index.tsx'),
        player: path.resolve(__dirname, 'src/helpers/styleguide/index.ts')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loaders: [
            {
              loader: 'ts-loader'
            }
          ]
        },
      ],
    },
  },
};
