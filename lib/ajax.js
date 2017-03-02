'use strict'
var http = require('http')
var https = require('https')
var session = require('./session.js')
var isWindow = typeof window !== 'undefined' && window.window === window
// 发送请求
module.exports = function ajax (o) {
  return isWindow ? ajaxbyWindow(o) : ajaxbyNode(o)
}
function ajaxbyWindow (o) {
  return new Promise(function (resolve, reject) {
    var url = parseUrl({
      protocol: (o.protocol || 'http:'),
      host: o.host,
      port: (o.port || '80'),
      path: (o.path || '/')
    })
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
        var statusText = xhr.statusText
        if (status >= 200 && status < 300) {
          var serverRes = {}
          serverRes.headers = {}
          serverRes.rawHeaders = []
          serverRes.body = xhr.response
          serverRes.statusCode = xhr.status
          serverRes.statusMessage = xhr.statusText
          serverRes.status = xhr.statusText

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
          resolve(serverRes)
        } else {
          var e = new Error(statusText)
          e.statusCode = xhr.status
          e.statusMessage = xhr.statusText
          e.status = xhr.statusText
          reject(e)
        }
      }
    }
    // 连接 和 发送 - 第二步
    xhr.open((o.method || 'GET').toUpperCase(), url, true)
    // 设置表单提交时的内容类型
    var key, value, headers
    headers = o.headers
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
    xhr.send(o.body || null)
  })
}
function ajaxbyNode (o) {
  return new Promise(function (resolve, reject) {
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
      var serverRes = {}
      serverRes.body = ''
      response.on('data', function (data) {
        serverRes.body += data
      }).on('end', function () {
        serverRes.statusCode = response.statusCode || 200
        serverRes.status = response.statusMessage.toString() || 'UNKNOW_ERROR'
        serverRes.rawHeaders = response.rawHeaders || []
        serverRes.headers = response.headers || Object.create(null)
        resolve(serverRes)
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
function parseUrl (obj) {
  var r = ''
  r += obj.protocol || 'http:'
  r += '//' + (obj.host || '')
  r += obj.port ? (((obj.protocol == 'http:' && obj.port == '80') || (obj.protocol == 'https:' && obj.port == '443')) ? '' : (':' + obj.port)) : ''
  obj.pathquery = obj.pathquery || (obj.path || '/') + (obj.query ? ('?' + obj.query) : '')
  r += obj.pathquery
  return r
}
