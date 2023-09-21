const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common');

const kilobyte = 1024;

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
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
      template: path.resolve(path.resolve(__dirname, '../src'), 'index.html'),
    }),
    new webpack.EnvironmentPlugin(['SENTRY_RELEASE']),
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 1015 * kilobyte, // we set this as the current largest - could maybe go lower
    maxEntrypointSize: 2048 * kilobyte,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      maxInitialRequests: Infinity,
      minSize: 1015 * kilobyte,
      maxSize: 1536 * kilobyte,
      cacheGroups: {
        default: {
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
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
