const chmod = require('chmod')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')

const config = {
  entry: [
    './index.js'
  ],

  devtool: 'source-map',

  target: 'node',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: __dirname,
      exclude: /node_modules/
    }]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './phantomjs', to: './'
      },
      {
        from: './phantom-script.js', to: './'
      }
    ]),
    new WebpackOnBuildPlugin(() => {
      chmod('.webpack/phantomjs', 777)
    })
  ]
}

module.exports = config
