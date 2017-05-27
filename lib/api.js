'use strict'
// 工具
var util = require('../util')
var url = require('./url.js')
var request = require('./request.js')
var sign = require('./sign.js')
var parseDataByBody = require('./parseDataByBody.js')
var EventEmitter = require('../events')
Object.assign(ddvRestFulApi, EventEmitter.prototype, new EventEmitter())
// eslint-disable-next-line no-undef
if (typeof define !== 'undefined' && typeof requirejs !== 'undefined') {
  // eslint-disable-next-line no-undef
  define(ddvRestFulApi)
}
if (module && module.exports) {
  // 导出模块
  module.exports = ddvRestFulApi
}
if (typeof window !== 'undefined' && window.window === window) {
  window.ddvRestFulApi = ddvRestFulApi
}
// 方法
function ddvRestFulApi (path, req, res) {
  var promise = new Promise(function (resolve, reject) {
    new Promise(function (resolve, reject) {
      // 下一进程运行
      util.nextTick(function () {
        // 这个直接提交，因为该操作仅仅是为了延迟
        resolve()
        // 回收
        resolve = reject = void 0
      })
    })
    .then(function () {
      // 初始化接口
      return apiPromiseInit(promise, path, req, res)
    })
    .then(function () {
      // 回收资源
      path = req = res = void 0
      // api接口运行
      return apiPromiseRun(promise)
      .then(function (res) {
        return parseDataByBody(res)
      }, function (e) {
        return parseDataByBody(e, true)
      })
    })
    .catch(function (e) {
      e.statusCode = e.statusCode || e.errorCode || e.code
      e.errorId = e.errorId || e.error_id || e.status || e.statusMessage
      e.message = e.message || e.msg || e.errorId
      return Promise.reject(e)
    })
    .then(function (res) {
      util.nextTick(function () {
        util.isFunction(promise.destroy) && promise.destroy()
        // 回收资源
        promise = void 0
      })
      return res
    })
    // 绑定回调
    .then(resolve, reject)
    // 回收
    resolve = reject = void 0
  })
  return apiPromiseBaseInit(promise)
}
function apiPromiseRun (promise) {
  return sign(promise.options)
  .then(function (options) {
    return request(options)
    .catch(function (e) {
      if (parseInt(e.statusCode) === 403) {
        promise.options.isSessionInit = true
        // 重新运行一次
        return apiPromiseRun(promise)
      } else {
        // 还是原路抛出错误
        return Promise.reject(e)
      }
    })
  })
}
function apiPromiseInit (promise, path, req, res) {
  var options = promise.options
  return new Promise(function (resolve, reject) {
    if (typeof path === 'object') {
      promise.path(path.path)
      promise.sendData(path.data)
      promise.headers(path.headers)
      promise.method(path.method)
      resolve()
    } else if (typeof path === 'string') {
      promise.path(path || '/')
      resolve()
    } else {
      var e = new Error('method type error')
      e.errorId = 'UNKNOW_ERROR'
      reject(e)
    }
  }).then(function () {
    // 设定请求对象
    if (req && req.req && req.res) {
      promise.context(req)
    } else {
      promise.req(req)
      promise.res(res)
    }
  }).then(function () {
    options.method = options.method || 'GET'
    options.queryObject = options.queryObject || Object.create(null)
    if (typeof options.query === 'object') {
      options.query = ''
      Object.assign(options.queryObject, options.query)
    }
    options.path = options.path || '/'
    options.path = (options.path.charAt(0) === '/' ? '' : '/') + options.path
    options.query = (url('query', options.path) || '').toString()
    options.path = url('path', options.path) || '/'
    options.baseUrl = options.baseUrl || ddvRestFulApi.baseUrl || ''
    options.isServerNode = (options.req && options.res && true) || false

    options.host = url('hostname', options.baseUrl)
    options.port = url('port', options.baseUrl)
    options.protocol = url('protocol', options.baseUrl)
    options.request_id = options.request_id || util.createRequestId()
  }).then(function removeUndefinedValue () {
    var key
    for (key in options.queryObject) {
      if (options.queryObject[key] === void 0) {
        delete options.queryObject[key]
      }
    }
    for (key in options.data) {
      if (options.data[key] === void 0) {
        delete options.data[key]
      }
    }
    for (key in options.headers) {
      if (options.headers[key] === void 0) {
        delete options.headers[key]
      }
    }
  }).then(function buildParamsRun () {
    var str
    if (options.queryObject) {
      str = util.buildParams(options.queryObject, true)
      if (str) {
        options.query += (options.query.length > 0 ? '&' : '') + str
      }
    }
    if (options.method === 'GET') {
      str = util.buildParams(options.data, true)
      if (str) {
        options.query += (options.query.length > 0 ? '&' : '') + str
      }
    } else {
      options.body = util.buildParams(options.data)
    }
    options = void 0
  })
}

function apiPromiseBaseInit (promise) {
  // 基本参数
  Object.assign(promise, {
    options: {
      path: '/',
      method: 'GET',
      headers: Object.create(null),
      data: Object.create(null),
      query: Object.create(null),
      req: null,
      res: null
    }
  })
  // 基本方法
  Object.assign(promise, {
    headers: function headers (input) {
      this.options.headers = this.options.headers || Object.create(null)
      Object.assign(this.options.headers, input || Object.create(null))
      return this
    },
    path: function path (input) {
      this.options.path = (input || '/').toString()
      return this
    },
    method: function method (input) {
      this.options.method = (input || this.options.method || 'GET').toString().toUpperCase()
      return this
    },
    // 发送别名
    send: function sendData (input) {
      this.options.data = this.options.data || Object.create(null)
      Object.assign(this.options.data, input || Object.create(null))
      return this
    },
    query: function query (input) {
      this.options.query = this.options.query || Object.create(null)
      Object.assign(this.options.query, input || Object.create(null))
      return this
    },
    req: function req (input) {
      this.options.req = input || this.options.req || null
    },
    res: function res (input) {
      this.options.res = input || this.options.res || null
    },
    context: function context (input) {
      if (input.req && input.res) {
        this.req(input.req)
        this.res(input.res)
      } else if (input.requests && input.response) {
        this.req(input.requests)
        this.res(input.response)
      }
    },
    // 销毁
    destroy: function destroy () {
      util.nextTick.call(this, function () {
        var key
        for (key in this) {
          if (!Object.hasOwnProperty.call(this, key)) continue
          delete this[key]
        }
        key = void 0
      })
    }
  })
  // 基本方法
  Object.assign(promise, {
    // 发送别名
    sendData: promise.send,
    // 成功别名
    success: promise.then,
    // 错误别名
    error: promise.catch,
    // 失败别名
    fail: promise.catch
  })
  return promise
}

// 继承使用 Promise 的继承
ddvRestFulApi.prototype = Promise.prototype
// 默认导出支持 - 允许在 TypeScript 中使用默认导入语法
ddvRestFulApi['default'] = ddvRestFulApi
// 复制 Promise 的一些方法
'all race reject resolve'.split(' ').forEach(function (key) {
  ddvRestFulApi[key] = function () {
    return Promise[key].apply(Promise, arguments)
  }
})
// 支持五大请求
'get post put patch del delete'.split(' ').forEach(function (key) {
  if (!key) {
    key = 'get'
  }
  ddvRestFulApi[key] = function ddvRestFulApiMethod () {
    key = key === 'del' ? 'delete' : key
    return ddvRestFulApi.apply(ddvRestFulApi, arguments).method(key.toUpperCase())
  }
})

require('./apiTryData.js')
// 对外扩张接口
require('./apiExternal.js')
