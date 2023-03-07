const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const path = require('path');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: path.resolve(path.resolve(__dirname, '../src'), 'index.tsx'),

  // Allows ts(x) and js files to be imported without extension
  resolve: {
    fallback: { querystring: require.resolve('querystring-es3') },
    extensions: ['.ts', '.tsx', '.js', '.less'],
    alias: {
      src: path.resolve(__dirname, '../src'),
      resources: path.resolve(__dirname, '../src/resources'),

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
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
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
                  isDevelopment && ReactRefreshTypeScript(),
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
  // Add cache configuration for the entire build process
  cache: {
    type: 'filesystem',
    name: 'bwa-cache',
    cacheDirectory: path.resolve(__dirname, '../node_modules'),
    store: 'pack',
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css', ignoreOrder: true }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../src/resources'), to: 'assets' },
      ],
    }),
  ],
};
