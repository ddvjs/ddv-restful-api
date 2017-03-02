'use strict'
// 下一进程运行
var nextTick = require('./nextTick.js')
// 错误模块
var ApiError = require('./ApiError.js')
// 请求模块
var request = require('./request.js')
// 导出模块
module.exports = function apiPromiseRun (_promise, path, req, res) {
  return new Promise(function (resolve, reject) {
    if (typeof path === 'object') {
      _promise.path(path.path)
      _promise.sendData(path.data)
      _promise.headers(path.headers)
      _promise.method(path.method)
      resolve()
    } else if (typeof path === 'string') {
      _promise.path(path || '/')
      resolve()
    } else {
      var e = null
      e = new ApiError('method type error')
      reject(e)
    }
  }).then(function () {
    // 设定请求对象
    if (req && req.req && req.res) {
      _promise.context(req)
    } else {
      _promise.req(req)
      _promise.res(res)
    }
  }).then(function () {
    return new Promise(function (resolve, reject) {
      nextTick(function () {
        request(_promise, function (e, res) {
          e ? reject(e) : resolve(res)
        })
      })
    })
  }).then(function (_request) {
    return new Promise(function (resolve, reject) {
      var r = null
      var e = null
      var res = _request.serverRes
      try {
        r = JSON.parse(res.body)
      } catch (e1) {
        e = e1
        e.body = res.body
        console.log(e.body)
      }
      if (e) {
        e.statusCode = res.statusCode
        e.error_id = res.status
        e.message = res.status || 'Unknow Error'
        reject(e)
      } else if (r) {
        if (r.state) {
          r.statusCode = r.statusCode || r.code || res.statusCode
          r.error_id = r.error_id || res.status
          r.message = r.message || r.msg || res.status || 'Unknow Error'
          resolve(r)
        } else {
          e = new Error(r.message || r.msg || res.status || 'Unknow Error')
          e.statusCode = r.statusCode || r.code || res.statusCode
          e.error_id = r.error_id || res.status
          e.message = r.message || r.msg || res.status || 'Unknow Error'
          reject(e)
        }
      }
      _request.destroy()
      _request = resolve = reject = r = e = res = void 0
    })
  })
}
