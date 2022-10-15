const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

const srcPath = path.resolve(__dirname, '../src');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: srcPath,
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
  },
  devServer: {
    static: srcPath,
    port: 9000,
    host: 'localhost',
    hot: true,
    https: false,
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css', ignoreOrder: true }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'silent-check-sso.html',
      template: path.resolve(srcPath, 'silent-check-sso.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index-dev.html'),
    }),
  ],
});
