// 一定要导出提前
module.exports = request
var http = require('http')
var https = require('https')
var url = require('ddv-auth/util/url')
var isWindow = typeof window !== 'undefined' && window.window === window
// 发送请求
function request (uri, body, method, headers) {
  method = method || 'GET'
  return isWindow ? ajaxbyWindow(uri, body, method, headers) : ajaxbyNode(uri, body, method, headers)
}
function ajaxbyWindow (uri, body, method, headers) {
  return new Promise(function (resolve, reject) {
    var xhr

    // 创建 - 非IE6 - 第一步
    if (typeof window !== 'undefined' && window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest()
    } else {
      // IE6及其以下版本浏览器
      xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
    }

    // 接收 - 第三步
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var status = xhr.status
        var serverRes = {}
        serverRes.headers = {}
        serverRes.rawHeaders = []

        var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
        headers.forEach(function (header) {
          var matches = header.match(/^([^:]+):\s*(.*)/)
          if (matches) {
            var key = matches[1].toLowerCase()
            if (key === 'set-cookie') {
              if (serverRes.headers[key] === undefined) {
                serverRes.headers[key] = []
              }
              serverRes.headers[key].push(matches[2])
            } else if (serverRes.headers[key] !== undefined) {
              serverRes.headers[key] += ', ' + matches[2]
            } else {
              serverRes.headers[key] = matches[2]
            }
            serverRes.rawHeaders.push(matches[1], matches[2])
          }
        })
        serverRes.body = xhr.response
        serverRes.statusCode = xhr.status
        serverRes.statusMessage = xhr.statusText
        serverRes.status = serverRes.statusMessage

        if (status < 200 || status >= 400) {
          serverRes.uri = uri
          serverRes.method = method
          serverRes.headers = headers
        }
        uri = body = method = headers = void 0
        status >= 200 && status < 300 ? resolve(serverRes) : reject(serverRes)
      }
    }
    // 连接 和 发送 - 第二步
    xhr.open(method.toUpperCase(), uri, true)
    // 设置表单提交时的内容类型
    var key, value
    for (key in headers) {
      if (key.toLowerCase() === 'host' || key.toLowerCase() === 'content-length') {
        continue
      }
      value = headers[key]
      if (Array.isArray(value)) {
        value.forEach(function (vt) {
          xhr.setRequestHeader(key, vt)
        })
      } else {
        xhr.setRequestHeader(key, headers[key])
      }
      value = Array.isArray(value) ? value.join(' ') : value
    }
    xhr.send(body || null)
  })
}
function ajaxbyNode (uri, body, method, headers) {
  return new Promise(function (resolve, reject) {
    var req, uriOpt
    uriOpt = url.parse(uri)
    var opt = {
      method: method,
      headers: headers || {},
      host: uriOpt.host,
      protocol: uriOpt.protocol || (uriOpt.scheme + ':'),
      path: (uriOpt.query ? (uriOpt.path + '?' + uriOpt.query) : uriOpt.path)
    }

    if (uriOpt.port) {
      opt.port = uriOpt.port
    }

    if ((!(opt.headers.host || opt.headers.Host))) {
      opt.headers.Host = opt.host
    }
    uriOpt = void 0
    // 发送请求
    req = (opt.protocol === 'http:' ? http : https).request(opt, function (response) {
      var serverRes = {}
      serverRes.body = ''
      response.on('data', function (data) {
        serverRes.body += data
      }).on('end', function () {
        serverRes.headers = response.headers || Object.create(null)
        serverRes.rawHeaders = response.rawHeaders || []
        serverRes.statusCode = response.statusCode || 200
        serverRes.statusMessage = response.statusMessage.toString() || 'UNKNOW_ERROR'
        serverRes.status = serverRes.statusMessage
        if (serverRes.status < 200 || serverRes.status >= 400) {
          serverRes.uri = uri
          serverRes.method = method
          serverRes.headers = headers
        }
        uri = body = method = headers = void 0
        serverRes.statusCode >= 200 && serverRes.statusCode < 300 ? resolve(serverRes) : reject(serverRes)
      })
    })
    if (body) {
      req.write(body)
    }
    req.on('error', function (e) {
      Object.assign(e, this)
      reject(e)
    })
    req.end()
    opt = req = void 0
  })
}
