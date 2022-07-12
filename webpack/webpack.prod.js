const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common');

const srcPath = path.resolve(__dirname, '../src');
const kilobyte = 1024;

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].[fullhash:20].js',
    chunkFilename: '[name].[chunkhash:20].chunk.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash:20].css',
      chunkFilename: '[name].[chunkhash:20].chunk.css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.html'),
    }),
    new webpack.EnvironmentPlugin(['SENTRY_RELEASE']),
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 1015 * kilobyte, // we set this as the current largest - could maybe go lower
    maxEntrypointSize: 1084 * kilobyte,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimize: true,
    minimizer: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new CssMinimizerPlugin(),
      new TerserPlugin({ terserOptions: { sourceMap: true }, parallel: true }),
    ],
  },
});
