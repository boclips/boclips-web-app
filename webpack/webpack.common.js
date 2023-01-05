const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');

const path = require('path');

const srcPath = path.resolve(__dirname, '../src');
const resourcePath = path.resolve(__dirname, '../src/resources');

module.exports = {
  entry: path.resolve(srcPath, 'index.tsx'),

  // Allows ts(x) and js files to be imported without extension
  resolve: {
    fallback: { querystring: require.resolve('querystring-es3') },
    extensions: ['.ts', '.tsx', '.js', '.less'],
    alias: {
      src: srcPath,
      resources: resourcePath,

      // Needed when library is linked via `npm link` to app
      react: path.resolve('./node_modules/react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: ['/node_modules/', '/storybook'],
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'lib',
                    style: true,
                  }),
                ],
              }),
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /^((?!\.module).)*less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        // for css modules
        test: /\.module.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentContext: __dirname,
                localIdentName: '[local]--[hash:base64:5]',
                mode: 'local',
              },
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: resourcePath, to: 'assets' }],
    }),
  ],
};
