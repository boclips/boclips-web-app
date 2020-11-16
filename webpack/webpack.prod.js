const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const srcPath = path.resolve(__dirname, '../src');
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
      template: path.resolve(srcPath, 'index.html'),
    }),
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 800 * kilobyte, // we set this as the current largest - could maybe go lower
    maxEntrypointSize: 450 * kilobyte,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
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
