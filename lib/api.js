// 导出模块 -- 因为打包工具的特殊性，导出模块必须提前，否则异常
module.exports = ddvRestFulApi
var url = require('ddv-auth/util/url')
var ddvRestFulApiPrototype = require('./ddvRestFulApiPrototype.js')
var AuthSha256 = require('ddv-auth/lib/AuthSha256')
var signUtil = require('ddv-auth/util/sign')
var modelPromise = require('./modelPromise.js')
var parseDataByBody = require('./parseDataByBody.js')
var isApi = require('./isApi.js')
var util = require('../util')
// 方法
function ddvRestFulApi (path, requests, response) {
  var apiStartStack = ''
  var apiStartStackError
  var apiStartStackErrorIndex
  var auth = new AuthSha256()
  var isNative = false
  var api = isApi(this) ? this : ddvRestFulApi
  auth.setUri(api.baseUrl)
  try {
    apiStartStackError = new Error('get api stack')
    apiStartStackErrorIndex = apiStartStackError.stack.indexOf('\n')
    if (apiStartStackErrorIndex > -1) {
      apiStartStack = apiStartStackError.stack.substr(apiStartStackErrorIndex) || apiStartStack
    }
  } catch (e) {

  }

  apiStartStackError = apiStartStackErrorIndex = void 0
  return modelPromise(function () {
    return Promise.resolve()
      .then(function () {
        if (api.onModelInit && util.isFunction(api.onModelInit)) {
          return api.onModelInit(this)
        }
      }.bind(this))
      .then(function () {
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
            var mbStringLength = function (s) {
              var totalLength = 0
              var i
              var charCode
              for (i = 0; i < s.length; i++) {
                charCode = s.charCodeAt(i)
                if (charCode < 0x007f) {
                  totalLength = totalLength + 1
                } else if ((charCode >= 0x0080) && (charCode <= 0x07ff)) {
                  totalLength += 2
                } else if ((charCode >= 0x0800) && (charCode <= 0xffff)) {
                  totalLength += 3
                }
              }
              return totalLength
            }

            if (this.isJsonBody) {
              body = JSON.stringify(this.sendData)
              if (body && body.length > 0) {
                auth.headers['Content-Length'] || auth.setHeaders('Content-Length', mbStringLength(body))
                auth.headers['Content-Type'] || auth.setHeaders('Content-Type', 'application/json')
                auth.setHeaders('Content-Md5', signUtil.md5Base64(body))
              }
            } else {
              body = url.buildQuery(this.sendData)
              if (body && body.length > 0) {
                auth.headers['Content-Length'] || auth.setHeaders('Content-Length', mbStringLength(body))
                auth.headers['Content-Type'] || auth.setHeaders('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
                auth.setHeaders('Content-Md5', signUtil.md5Base64(body))
              }
            }
          }
          delete this.sendData
        }
        var host = auth.host

        if (auth.port) {
          host += ':' + auth.port
        }
        auth.setHeaders('Host', host)
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
        isNative = !!this.isNative
        this.isNative = false
        requests = response = path = auth = key = void 0
        return Promise.resolve()
          .then(function () {
            if (api.onModelInitend && util.isFunction(api.onModelInitend)) {
              return api.onModelInitend(this)
            }
          }.bind(this))
          .then(function () {
            return body
          })
      }.bind(this))
      .then(function (body) {
        if (this.isAuth === true) {
          return ddvRestFulApiNextRun(this.auth, body, this.requests, this.response, this.request, this.onAccessKey, 0, (api.onAccessKeyTrySum || 3), isNative, api)
        } else {
          return this.request(auth.getUri(), body, auth.method, auth.headers, api)
            .then(function (res) {
              auth = body = void 0
              if (isNative === true) {
                var resBody = res.body
                if (typeof resBody === 'string') {
                  resBody = JSON.parse(resBody)
                }
                return resBody
              } else {
                return parseDataByBody(res)
              }
            })
        }
      }.bind(this))
      .then(function (res) {
        // 销毁
        this && this.destroy && this.destroy()
        return res
      }.bind(this))
      .catch(function (e) {
        // 销毁
        this && this.destroy && this.destroy()

        if (this.isNative === true) {
          return Promise.reject(e)
        }
        // 处理错误
        e.statusCode = e.statusCode || e.errorCode || e.code
        e.statusMessage = e.errorId = e.errorId || e.statusMessage || e.status || e.error_id
        e.message = e.message || e.msg || e.errorId
        if (this.apiStartStack) {
          e.stack += '\n' + this.apiStartStack
        }
        e.type = e.type || 'DdvRestFulApiError'
        e.name = 'DdvRestFulApiError'
        return Promise.reject(e)
      }.bind(this))
  }, ddvRestFulApiPrototype, api.protoExtend, {
    protoExtend: api.protoExtend,
    apiStartStack: apiStartStack,
    auth: auth,
    isJsonBody: true,
    isAuth: true,
    sendData: Object.create(null),
    request: api.request || function () {
      return Promise.reject(new Error('request method must set'))
    },
    requests: api.requests || null,
    response: api.response || null,
    onAccessKey: api.onAccessKey || function () {
      return Promise.reject(new Error('onAccessKey method must set'))
    }
  })
}
// 运行这个请求
function ddvRestFulApiNextRun (auth, body, requests, response, requestRun, onAccessKey, tryNum, trySum, isNative, api) {
  // options.isServerNode = (requests && response && true) || false
  // ====设定请求对象====
  tryNum = tryNum || 0
  return onAccessKey(auth, requests, response, tryNum)
    .then(function () {
      if (auth.headers['authorization']) {
        delete auth.headers['authorization']
      }
      if (auth.headers['Authorization']) {
        delete auth.headers['Authorization']
      }
      auth.headers['Authorization'] = auth.getAuthString()
      return requestRun(auth.getUri(), body, auth.method, auth.headers, api)
        .then(function (res) {
          auth = body = void 0
          return isNative === true ? res : parseDataByBody(res)
        })
        .catch(function (e) {
          var r
          if (parseInt(e.statusCode) === 403 && tryNum < trySum) {
            // 重新运行一次
            r = ddvRestFulApiNextRun(auth, body, requests, response, requestRun, onAccessKey, (tryNum + 1), trySum, isNative, api)
          } else {
            // 还是原路抛出错误
            r = isNative === true ? e : parseDataByBody(e, true)
          }
          auth = body = requests = response = tryNum = void 0
          return r
        })
    })
}

// 默认导出支持 - 允许在 TypeScript 中使用默认导入语法
ddvRestFulApi['default'] = ddvRestFulApi

// 对外扩张接口
require('./apiExternal.js')
