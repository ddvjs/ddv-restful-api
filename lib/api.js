'use strict'
var api = module.exports = function ddvRestFulApi (path, req, res) {
  var _promise = new Promise(function (resolve, reject) {
    nextTick(function () {
      apiPromiseRun(_promise, path, req, res).then(resolve, reject)
    })
  })
  apiPromisePrototype(_promise)
  _promise._baseUrl = api.baseUrl
  return _promise
}
// 下一进程运行
var nextTick = require('./nextTick.js')
// api Promise 运行
var apiPromiseRun = require('./apiPromiseRun.js')
// api Promise 继承
var apiPromisePrototype = require('./apiPromisePrototype.js')
// 允许在 TypeScript 中使用默认导入语法
api['default'] = api
require('./apiTryData.js')
// 对外扩张接口
require('./apiExternal.js')
