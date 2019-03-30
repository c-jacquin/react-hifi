const path = require('path');

module.exports = {
  title: 'react-sound-html5',
  components: 'src/components/**/*.tsx',
  styleguideDir: 'docs',
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse,
  webpackConfig: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: ['node_modules'],
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
