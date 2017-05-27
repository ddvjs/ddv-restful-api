'use strict'
var api = require('./api.js')
api.url = require('./url.js')
api.sign = require('./sign.js')
api.session = require('./session.js')
api.request = require('./request.js')
api.util = apiUtil
api.setBaseUrl = setBaseUrl
api.apiUtil = require('../util')
api.nextTick = api.apiUtil.nextTick
api.Promise = Promise
// 设置headersPrefix
api.setHeadersPrefix = api.sign.setHeadersPrefix
// 设置是否使用长存储
api.setLongStorage = api.session.setLongStorage
// 设置是否使用长存储
api.setSessionInitTrySum = api.session.setSessionInitTrySum
// 设置初始化session的path
api.setSessionInitPath = api.session.setSessionInitPath

// 默认安装一下方法
api.utilInitKey = 'api get post put del delete data'.split(' ')

// 安装模块
function apiUtil (util) {
  // 扩展请求接口
  api.utilInitKey.forEach(function (key) {
    util[key] = key === 'api' ? api : api[key]
  })
  // 承诺
  util.Promise = util.Promise || Promise
}
// 设置baseUrl
function setBaseUrl (baseUrl) {
  api.baseUrl = baseUrl
}
