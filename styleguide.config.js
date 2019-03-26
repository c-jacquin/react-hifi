const path = require('path');

module.exports = {
  title: 'react-sound-html5',
  components: 'src/components/**/*.tsx',
  styleguideDir: 'docs',
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
  webpackConfig: {
    entry: {
      app: path.resolve(__dirname, 'src/index.ts'),
    },
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
              loader: 'awesome-typescript-loader'
            },
            {
              loader: 'react-docgen-typescript-loader'
            },
          ]
        },
        {
          test: /\.(mp3|ogg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        },
      ],
    },
  },
};
