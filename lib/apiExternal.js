'use strict'
var api = require('./api.js')
api.url = require('./url.js')
api.ajax = require('./ajax.js')
api.sign = require('./sign.js')
api.session = require('./session.js')
api.request = require('./request.js')
api.nextTick = require('../util').nextTick
api.Promise = Promise
// 设置headersPrefix
api.setHeadersPrefix = api.sign.setHeadersPrefix
// 设置是否使用长存储
api.setLongStorage = api.session.setLongStorage
// 设置是否使用长存储
api.setSessionInitTrySum = api.session.setSessionInitTrySum
// 设置初始化session的path
api.setSessionInitPath = api.session.setSessionInitPath

if (typeof window !== 'undefined' && window.window === window) {
  window.ddvRestFulApi = api
}
