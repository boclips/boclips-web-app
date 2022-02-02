const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { merge } = require('webpack-merge');
const production = require('./webpack.prod');

module.exports = merge(production, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
  ],
});
