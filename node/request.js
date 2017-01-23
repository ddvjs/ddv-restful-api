'use strict'
const request = module.exports = function request (o, callback) {
  return new request.Request(o, callback)
}
const http = require('http')
const https = require('https')
const url = require('./url.js')
const sign = require('./sign.js')
const api = require('./api.js')
const session = require('./session.js')
request.Request = class ddvRequest {
  constructor (o, callback) {
    // 回调
    this.callback = callback
    // 基本参数初始化
    this._baseInit(o)
    // 请求参数编码
    this._buildParams()
    // 开始运行
    this._run()
  }
  _baseInit (o) {
    this.serverRes = Object.create(null)
    this.serverRes.statusCode = 0
    this.serverRes.status = 'UNKNOW_ERROR'
    this.serverRes.body = ''
    this.input_o = o
    this.method = o._method || 'GET'
    this.headers = o._headers || Object.create(null)
    this.data = o._data || Object.create(null)
    this.queryObject = o._query || Object.create(null)
    this.path = o._path || '/'
    this.path = (this.path.charAt(0) === '/' ? '' : '/') + this.path
    this.query = (url('query', this.path) || '').toString()
    this.path = url('path', this.path) || '/'
    this.baseUrl = o._baseUrl || this.baseUrl || request.baseUrl || api.baseUrl || ''

    this.req = o._req || null
    this.res = o._res || null
    this.isServerNode = this.req && this.res && true || false

    this.host = url('hostname', this.baseUrl)
    this.port = url('port', this.baseUrl)
    this.protocol = url('protocol', this.baseUrl)
    this.request_id = this.request_id || request.createRequestId()
  }
  _buildParams () {
    var str
    if (this.queryObject) {
      str = request.buildParams(this.queryObject, true)
      if (str) {
        this.query += (this.query.length > 0 ? '&' : '') + str
      }
    }
    if (this.method === 'GET') {
      str = request.buildParams(this.data, true)
      if (str) {
        this.query += (this.query.length > 0 ? '&' : '') + str
      }
    } else {
      this.body = request.buildParams(this.data)
    }
  }
  _run () {
    var _this = this
    // 签名
    sign(this).then(function (o) {
      return request.runRequest(o)
    }).then(function (_this) {
      if (_this && _this.callback) {
        _this.callback(null, _this)
      } else if (_this && _this.destroy) {
        _this.destroy()
      }
      _this = _this.callback = void 0
    }).catch(function (e) {
      if (_this && _this.callback) {
        _this.callback(e, _this)
      } else if (_this && _this.destroy) {
        _this.destroy()
      }
      _this = _this.callback = void 0
    })
  }
  destroy () {
    api.nextTick.call(this, function () {
      var key
      for (key in this) {
        if (!Object.hasOwnProperty.call(this, key)) continue
        delete this[key]
      }
      key = void 0
    })
  }
}
// 发送请求
request.runRequest = function runRequest (o) {
  return request.runRequestHttp(o).then(function () {
    var e
    if (o.serverRes.statusCode >= '200' && o.serverRes.statusCode < '300') {
      return o
    } else {
      e = new Error(o.serverRes.status)
      e.statusCode = o.serverRes.statusCode
      e.error_id = o.serverRes.status
      e.message = o.serverRes.status || 'Unknow Error'
      throw e
    }
  })
}
// 发送请求
request.runRequestHttp = function runRequestHttp (o) {
  return new api.Promise(function (resolve, reject) {
    var opt, req
    if (!(o.isServerNode || session.isClientWindow)) {
      // 不是浏览器和node服务器
      reject(new Error('Neither a browser nor req and res'))
      return
    }
    opt = {
      method: (o.method || 'GET'),
      protocol: (o.protocol || 'http:'),
      host: o.host,
      port: (o.port || '80'),
      path: (o.path || '/'),
      headers: o.headers
    }
    if (o.query) {
      opt.path += '?' + o.query
    }
    // 发送请求
    req = (opt.protocol === 'http:' ? http : https).request(opt, function (response) {
      o.serverRes.body = ''
      response.on('data', function (data) {
        o.serverRes.body += data
      }).on('end', function () {
        o.serverRes.statusCode = response.statusCode || 200
        o.serverRes.status = response.statusMessage.toString() || 'UNKNOW_ERROR'
        o.serverRes.rawHeaders = response.rawHeaders || []
        o.serverRes.headers = response.headers || Object.create(null)
        resolve(o)
      })
    })
    if (o.body) {
      req.write(o.body)
    }
    req.on('error', function (e) {
      reject(e)
    })
    req.end()
    opt = req = void 0
  })
}

request.kEscapedMap = {
  '!': '%21',
  '\'': '%27',
  '(': '%28',
  ')': '%29',
  '*': '%2A'
}
// path编码
request.urlEncodeExceptSlash = function (value) {
  return request.urlEncode(value, false)
}
// 编码
request.urlEncode = function (string, encodingSlash) {
  var result = encodeURIComponent(string)
  result = result.replace(/[!'()*]/g, function ($1) {
    return request.kEscapedMap[$1]
  })
  if (encodingSlash === false) {
    result = result.replace(/%2F/gi, '/')
  }
  return result
}
// 编码
request.buildParams = function (data, isQuery) {
  var r = request._buildParams(data, '').join('&')
  if (isQuery) {
    r = r.replace(/%20/gi, '+')
  }
  return r
}
request._buildParams = function (data, prefix) {
  var r = []
  var i, key, keyt, value
  if (typeof data === 'object') {
    // 数组
    if (Array.isArray(data)) {
      for (i = 0; i < data.length; i++) {
        // 值
        value = data[i]
        // 键
        keyt = request._buildParamsAddPrefix(i, prefix, (typeof value === 'object'))
        // 递归处理对象和数组
        if (typeof value === 'object') {
          // 插入数组
          r.push.apply(r, request._buildParams(value, keyt))
        } else {
          // 插入数组
          r.push(request.urlEncode(keyt) + '=' + request.urlEncode(value))
        }
      }
    } else {
      for (key in data) {
        if (!Object.hasOwnProperty.call(data, key)) {
          continue
        }
        // 值
        value = data[key]
        // 键
        keyt = request._buildParamsAddPrefix(key, prefix)
        if (typeof value === 'object') {
          // 插入数组
          r.push.apply(r, request._buildParams(value, keyt))
        } else {
          // 插入数组
          r.push(request.urlEncode(keyt) + '=' + request.urlEncode(value))
        }
      }
    }
  }
  return r
}
request._buildParamsAddPrefix = function (key, prefix, isNotArray) {
  if (prefix) {
    return prefix + '[' + (isNotArray !== false ? key : '') + ']'
  } else {
    return key
  }
}
// 生成请求id
request.createRequestId = function createRequestId () {
  var pid, rid, ridLen, ridT, ridNew, i
  // 获取16进制的 pid
  pid = Number(request.createNewPid(true)).toString(16)
  // 种子
  rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  ridNew = ''
  for (i = rid.length - 1; i >= 0; i--) {
    ridT = rid[i]
    if (ridT === 'x') {
      ridLen = pid.length
      ridT = pid ? pid.charAt(ridLen - 1) : 'x'
      pid = pid.substr(0, ridLen - 1)
    }
    ridNew = ridT + ridNew
  }
  rid = request.createGuid(ridNew)
  i = ridNew = ridT = ridLen = pid = undefined
  return rid
}
var createNewidSumLast, createNewidTimeLast
createNewidSumLast = 0
createNewidTimeLast = 0
request.createNewPid = function createNewid (is10) {
  var r
  if (createNewidTimeLast !== request.time()) {
    createNewidTimeLast = request.time()
    createNewidSumLast = 0
  }
  r = createNewidTimeLast.toString() + (++createNewidSumLast).toString()
    // 使用36进制
  if (!is10) {
    r = parseInt(r, 10).toString(36)
  }
  return r
}
// 生成guid
request.createGuid = function createGuid (s) {
  return (s || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
// 获取当前时间开始
request.now = function now () {
  return (new Date()).getTime()
}
// 获取php的时间戳
request.time = function time () {
  return parseInt(request.now() / 1000)
}
