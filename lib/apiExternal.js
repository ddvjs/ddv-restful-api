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
'get post put del delete'.split(' ').forEach(function (key) {
  key = (key === 'del' ? 'delete' : key) || 'get'
  api[key] = function ddvRestFulApiMethod () {
    return api.apply(api, arguments).method(key.toUpperCase())
  }
})

api.util = function apiUtil (util) {
  // 扩展请求接口
  'api get post put del delete data'.split(' ').forEach(function (key) {
    util[key] = key === 'api' ? api : api[key]
  })
  // 承诺
  util.Promise = util.Promise || Promise
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
