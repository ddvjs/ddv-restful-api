// var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    'index': './node/index.js'
  },
  output: {
    path: path.join(__dirname, './browser'),  // 设置打包后的js的输出位置
    filename: '[name].js'  // 和入口文件的名字相同
  },
  resolve: {
    extensions: ['.js', ''],
    alias: {  // 注册模块，以后用的时候可以直接requier("模块名")
    //    cookie: path.join(__dirname,"./static/js/jquery.cookie.js"),
    }
  },
  plugins: [
    /* new webpack.optimize.UglifyJsPlugin({
      output: {
      comments: false,
      },
      compress: {
      warnings: false
      }
    }) */
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  babel: {
    presets: ['es2015']
  },
  devtool: 'sourcemap'  // 生成用来调试的map
}
