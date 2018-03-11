var api = require('./api.js')
var isApi = require('./isApi.js')
var AutoRetry = require('./AutoRetry.js')
var url = require('ddv-auth/util/url')
var sign = require('ddv-auth/util/sign')
var parseDataByBody = require('./parseDataByBody.js')
var time = require('ddv-auth/util/time')
var util = require('ddv-auth/util')

var EventEmitter = require('../events')
api.getApi = getApi
api.time = time
api.parseDataByBody = parseDataByBody
api.sign = sign
api.url = url
api.authUtil = util
api.getApi(function (api) {
  api.setHeadersPrefix('x-ddv-')
}, api)

function getApi (cb, newApi) {
  newApi = typeof newApi === 'function' ? newApi : function newDdvApi () {
    return api.apply(newApi, arguments)
  }
  newApi[isApi.checkName] = isApi.checkValue
  Object.assign(newApi, EventEmitter.prototype, new EventEmitter())
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
  newApi._autoRetry = new AutoRetry()
  newApi.autoRetry = function autoRetry () {
    return AutoRetry.prototype.autoRetry.apply(newApi._autoRetry, arguments)
  }
  newApi.autoRetry.onCatch = function onCatch () {
    return AutoRetry.prototype.onCatch.apply(newApi._autoRetry, arguments)
  }
  newApi.autoRetry.onThen = function onThen () {
    return AutoRetry.prototype.onThen.apply(newApi._autoRetry, arguments)
  }
  newApi.autoRetry.onBegin = function onBegin () {
    return AutoRetry.prototype.onBegin.apply(newApi._autoRetry, arguments)
  }
  newApi.onAccessKeyTrySum = 3
  // 默认安装一下方法
  newApi.utilInitKey = 'api get post put del delete data'.split(' ')
  newApi.Promise = Promise
  newApi.setBaseUrl = setBaseUrl.bind(newApi)
  newApi.util = apiUtil.bind(newApi)
  newApi.setOnAccessKeyTrySum = setOnAccessKeyTrySum.bind(newApi)
  newApi.setOnAccessKey = setOnAccessKey.bind(newApi)
  newApi.setOnModelInit = setOnModelInit.bind(newApi)
  newApi.setOnModelInitend = setOnModelInitend.bind(newApi)
  // 设置headersPrefix
  newApi.setHeadersPrefix = setHeadersPrefix.bind(newApi)
  if (typeof cb === 'function') {
    cb.call(newApi, newApi)
  }
  return newApi
}
function setOnAccessKey (fn) {
  this.onAccessKey = fn
}
function setOnAccessKeyTrySum (num) {
  this.onAccessKeyTrySum = num
}
// 设置baseUrl
function setBaseUrl (baseUrl) {
  this.baseUrl = baseUrl
}
// 设置初始化回调
function setOnModelInit (fn) {
  this.onModelInit = fn
}
// 设置初始化回调
function setOnModelInitend (fn) {
  this.onModelInitend = fn
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
