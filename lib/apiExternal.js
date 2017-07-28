'use strict'
var api = require('./api.js')
api.getApi = getApi
getApi(function (api) {
  api.setHeadersPrefix('x-ddv-')
}, api)

function getApi (cb, newApi) {
  newApi = typeof newApi === 'function' ? newApi : function newDdvApi () {
    var model = api.apply(newApi, arguments)
    model.setUri(newApi.baseUrl)
    model.onAccessKey = newApi.onAccessKey || model.onAccessKey
    return model
  }
  // 继承使用 Promise 的继承
  newApi.prototype = Promise.prototype
  // 复制 Promise 的一些方法
  'all race reject resolve'.split(' ').forEach(function (key) {
    newApi[key] = function () {
      return Promise[key].apply(Promise, arguments)
    }
  })
  // 支持五大请求
  'get post put patch del delete'.split(' ').forEach(function (key) {
    if (!key) {
      key = 'get'
    }
    newApi[key] = function ddvRestFulApiMethod () {
      key = key === 'del' ? 'delete' : key
      return newApi.apply(newApi, arguments).method(key.toUpperCase())
    }
  })
  // 默认安装一下方法
  newApi.utilInitKey = 'api get post put del delete data'.split(' ')
  newApi.Promise = Promise
  newApi.setBaseUrl = setBaseUrl.bind(newApi)
  newApi.util = apiUtil.bind(newApi)
  // 设置headersPrefix
  newApi.setHeadersPrefix = setHeadersPrefix.bind(newApi)
  if (typeof cb === 'function') {
    cb.call(newApi)
  }
}
// 设置baseUrl
function setBaseUrl (baseUrl) {
  this.baseUrl = baseUrl
}
// 安装模块
function apiUtil (util) {
  var api = this
  // 扩展请求接口
  api.utilInitKey.forEach(function (key) {
    util[key] = key === 'api' ? api : api[key]
  })
  // 承诺
  util.Promise = util.Promise || api.Promise || Promise
}
// 设置headersPrefix
function setHeadersPrefix (headersPrefix) {
  this.headersPrefix = headersPrefix
}
