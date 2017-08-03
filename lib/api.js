'use strict'
// 导出模块 -- 因为打包工具的特殊性，导出模块必须提前，否则异常
module.exports = ddvRestFulApi
var url = require('ddv-auth/util/url')
var ddvRestFulApiPrototype = require('./ddvRestFulApiPrototype.js')
var AuthSha256 = require('ddv-auth/lib/AuthSha256')
var signUtil = require('ddv-auth/util/sign')
var request = require('./request.js')
var modelPromise = require('./modelPromise.js')
var parseDataByBody = require('./parseDataByBody.js')
var onAccessKey = require('./onAccessKey.js')
var isApi = require('./isApi.js')
// eslint-disable-next-line no-undef
if (typeof define !== 'undefined' && typeof requirejs !== 'undefined') {
  // eslint-disable-next-line no-undef
  define(ddvRestFulApi)
}
if (typeof window !== 'undefined' && window.window === window) {
  window.ddvRestFulApi = ddvRestFulApi
}
// 方法
function ddvRestFulApi (path, requests, response) {
  var auth = new AuthSha256()
  var api = isApi(this) ? this : ddvRestFulApi
  auth.setUri(api.baseUrl)
  return modelPromise(function () {
    var isReqRes = false
    // 判断类型
    if (requests && (!response)) {
      if (requests.req && requests.res) {
        this.req && this.req(requests.req)
        this.res && this.res(requests.res)
        isReqRes = true
      } else if (requests.requests && requests.response) {
        this.req && this.req(requests.requests)
        this.res && this.res(requests.response)
        isReqRes = true
      }
    }
    if (!isReqRes) {
      this.req && this.req(requests)
      this.res && this.res(response)
    }
    this.path && this.path(path)
    var key, body
    // 开始清除请求体参数中多余的参数
    for (key in this.sendData) {
      if ((!this.sendData[key]) && this.sendData[key] !== '' && this.sendData[key] !== 0) {
        delete this.sendData[key]
      }
    }
    if (this.sendData) {
      if (auth.method === 'GET') {
        auth.setQuery(this.sendData)
      } else {
        body = url.buildQuery(this.sendData)
        if (body && body.length > 0) {
          auth.headers['Content-Length'] || auth.setHeaders('Content-Length', body.length)
          auth.headers['Content-Type'] || auth.setHeaders('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
          auth.setHeaders('Content-Md5', signUtil.md5Base64(body))
        }
      }
      delete this.sendData
    }
    auth.setHeaders('Host', auth.host)
    // 开始清除请求中多余的参数
    for (key in auth.query) {
      if ((!auth.query[key]) && auth.query[key] !== '' && auth.query[key] !== 0) {
        delete auth.query[key]
      }
    }
    // 开始清除请求头中多余的参数
    for (key in auth.headers) {
      if ((!auth.headers[key]) && auth.headers[key] !== '' && auth.headers[key] !== 0) {
        delete auth.headers[key]
      }
    }
    requests = response = path = auth = key = void 0
    return ddvRestFulApiNextRun(this.auth, body, this.requests, this.response, this.onAccessKey, 0, (api.onAccessKeyTrySum || 3))
    .then(function (res) {
      // 销毁
      this && this.destroy && this.destroy()
      return res
    }.bind(this))
    .catch(function (e) {
      // 销毁
      this && this.destroy && this.destroy()
      // 处理错误
      e.statusCode = e.statusCode || e.errorCode || e.code
      e.errorId = e.errorId || e.error_id || e.status || e.statusMessage
      e.message = e.message || e.msg || e.errorId
      return Promise.reject(e)
    }.bind(this))
  }, ddvRestFulApiPrototype, {
    auth: auth,
    sendData: Object.create(null),
    requests: null,
    response: null,
    onAccessKey: api.onAccessKey || onAccessKey
  })
}
// 运行这个请求
function ddvRestFulApiNextRun (auth, body, requests, response, onAccessKey, tryNum, trySum) {
  // options.isServerNode = (requests && response && true) || false
  // ====设定请求对象====
  tryNum = tryNum || 0
  return onAccessKey(auth, requests, response, tryNum)
  .then(function () {
    var requestFn = ddvRestFulApi.request ? ddvRestFulApi.request : request
    var headers = auth.headers
    if (auth.headers['authorization']) {
      delete auth.headers['authorization']
    }
    if (auth.headers['Authorization']) {
      delete auth.headers['Authorization']
    }
    headers['Authorization'] = auth.getAuthString()
    return requestFn(auth.getUri(), body, auth.method, headers)
    .then(function (res) {
      auth = body = requests = response = tryNum = void 0
      return parseDataByBody(res)
    }, function (e) {
      var r
      if (parseInt(e.statusCode) === 403 && tryNum < trySum) {
        // 重新运行一次
        r = ddvRestFulApiNextRun(auth, body, requests, response, onAccessKey, (tryNum + 1), trySum)
      } else {
        // 还是原路抛出错误
        r = parseDataByBody(e, true)
      }
      auth = body = requests = response = tryNum = void 0
      return r
    })
  })
}

// 默认导出支持 - 允许在 TypeScript 中使用默认导入语法
ddvRestFulApi['default'] = ddvRestFulApi

require('./apiTryData.js')
// 对外扩张接口
require('./apiExternal.js')
