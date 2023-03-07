const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, '../src'),
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
  },
  devServer: {
    static: path.join(__dirname, '../src/resources/'),
    port: 9000,
    host: 'localhost',
    hot: true,
    client: { overlay: false },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'silent-check-sso.html',
      template: path.resolve(
        path.resolve(__dirname, '../src'),
        'silent-check-sso.html',
      ),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(
        path.resolve(__dirname, '../src'),
        'index-dev.html',
      ),
    }),
  ],
});
