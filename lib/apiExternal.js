'use strict'
var api = require('./api.js')
var url = require('./url.js')
var sign = require('./sign.js')
var session = require('./session.js')
var request = require('./request.js')
// 设置baseUrl
api.setBaseUrl = function (baseUrl) {
  request.baseUrl = api.baseUrl = baseUrl
}
// 设置headersPrefix
api.setHeadersPrefix = function (prefix) {
  sign.headersPrefix = request.headersPrefix = api.headersPrefix = prefix
}
// 设置是否使用长存储
api.setLongStorage = function (isUseLong) {
  session.isLongStorage = Boolean(isUseLong)
}
// 设置是否使用长存储
api.setSessionInitTrySum = function (sum) {
  session.initTrySum = sum || session.initTrySum
}
// 设置初始化session的path
api.setSessionInitPath = function (path) {
  session.sessionInitPath = path || session.sessionInitPath
}
// GET请求
api.get = function ddvRestFulApiGet (path, req, res) {
  return api(path, req, res).method('GET')
}
// POST请求
api.post = function ddvRestFulApiPost (path, req, res) {
  return api(path, req, res).method('POST')
}
// PUT请求
api.put = function ddvRestFulApiPut (path, req, res) {
  return api(path, req, res).method('PUT')
}
// DELETE请求
api.del = api['delete'] = function ddvRestFulApiDelete (path, req, res) {
  return api(path, req, res).method('DELETE')
}
api.url = url
api.sign = sign
api.session = session
api.request = request
api.Promise = Promise
api.prototype = Promise.prototype
'all race reject resolve'.split(' ').forEach(function (key) {
  api[key] = function () {
    return Promise[key].apply(Promise, arguments)
  }
})

api.util = function apiUtil (util) {
  // 扩展请求接口
  util.extend({
    api,
    get: api.get,
    post: api.post,
    put: api.put,
    del: api.del,
    data: api.data
  })
  // delete兼容性问题
  util['delete'] = api['delete']
  util['Promise'] = util['Promise'] || Promise
}

api.copyObjByKey = function copyObjByKey (oldObj, newObj, keys) {
  keys = keys || []
  keys.forEach(function (key) {
    oldObj[key] = newObj[key] || oldObj[key]
  })
}

if (typeof window !== 'undefined' && window.window === window) {
  window.ddvRestFulApi = api
}
