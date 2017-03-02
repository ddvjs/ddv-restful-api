'use strict'
// 下一进程运行
var nextTick = require('./nextTick.js')
// 导出模块
module.exports = function apiPromisePrototype (_promise) {
  _promise._path = '/'
  _promise._method = 'GET'
  _promise._headers = Object.create(null)
  _promise._data = Object.create(null)
  _promise._query = Object.create(null)
  _promise.headers = function headers (headers) {
    this._headers = this._headers || Object.create(null)
    Object.assign(this._headers, headers || Object.create(null))
    return this
  }
  _promise.path = function path (path) {
    this._path = (path || '/').toString()
    return this
  }
  _promise.method = function method (method) {
    this._method = (method || this._method || 'GET').toString().toUpperCase()
    return this
  }

  // 发送别名
  _promise.send = _promise.sendData = function sendData (data) {
    this._data = this._data || Object.create(null)
    Object.assign(this._data, data || Object.create(null))
    return this
  }
  _promise.query = function query (data) {
    this._query = this._query || Object.create(null)
    Object.assign(this._query, data || Object.create(null))
    return this
  }
  _promise.req = function req (req) {
    this._req = req || this._req || null
  }
  _promise.res = function res (res) {
    this._res = res || this._res || null
  }
  _promise.context = function context (context) {
    if (context.req && context.res) {
      this.req(context.req)
      this.res(context.res)
    } else if (context.requests && context.response) {
      this.req(context.requests)
      this.res(context.response)
    }
  }
  _promise._apiDestroy = function _apiDestroy () {
    nextTick.call(this, function () {
      var key
      for (key in this) {
        if (!Object.hasOwnProperty.call(this, key)) continue
        delete this[key]
      }
      key = void 0
    })
  }
  // 成功别名
  _promise.success = _promise.then
  // 错误别名
  _promise.error = _promise.catch
  // 失败别名
  _promise.fail = _promise.catch
}
