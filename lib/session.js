/* global localStorage sessionStorage VS_COOKIEDM */
// 导出 session 模块
module.exports = session
// 工具
var util = require('../util')
// api模块
var api = require('./api.js')
// url模块
var url = require('./url.js')
// 签名模块
var sign = require('./sign.js')
// 请求模块
var request = require('./request.js')
// 编码加密模块
var cryptoJsCore = require('crypto-js/core')
// 编码base64模块
var cryptoJsBase64 = require('crypto-js/enc-base64')
// var cryptoJsUtf8 =
require('crypto-js/enc-utf8')
var getSessionTrueCbs = []
var getSessionInitCbs = []
var _getSessionTrueDataCbsIng = false
var _getSessionInitCbsIng = false
// 对外api接口模块
Object.assign(session, {
  // 设置是否使用长存储
  setLongStorage: function setLongStorage (isUseLong) {
    session.isLongStorage = Boolean(isUseLong)
  },
  // 设置是否使用长存储
  setSessionInitTrySum: function setSessionInitTrySum (sum) {
    session.initTrySum = sum || session.initTrySum
  },
  // 设置初始化session的path
  setSessionInitPath: function setSessionInitPath (path) {
    session.sessionInitPath = path || session.sessionInitPath
  }
})
// 对外 cookie 编码 接口模块
Object.assign(session, {
  // 解码
  unescape: function (str) {
    return unescape(str || '')
  },
  // 编码
  escape: function (str) {
    return escape(str || '')
  }
})
Object.assign(session, {
  // 会话初始化
  init: function (o) {
    o = o || Object.create(null)
    return new Promise(function (resolve, reject) {
      var isRun = false
      // 处理回调
      if (o.isServerNode) {
        o.req._getSessionInitCbs = o.req._getSessionInitCbs || []
        // 服务端-处理同一请求多次初始化会话的问题，同一回调
        o.req._getSessionInitCbs.push([resolve, reject, o])
        o.req._getSessionInitCbs.push([function () {
          if (this && this.req) {
            this.req._getSessionInitCbsIng = false
          }
        }.bind(o), function () {
          if (this && this.req) {
            this.req._getSessionInitCbsIng = false
          }
        }.bind(o), o])
        if (o.req._getSessionInitCbsIng !== true) {
          isRun = true
          o.req._getSessionInitCbsIng = true
        }
      } else if (session.isClientWindow) {
        // 浏览器-处理同一请求多次初始化会话的问题，同一回调
        getSessionInitCbs.push([resolve, reject, o])
        getSessionInitCbs.push([function () {
          _getSessionInitCbsIng = false
        }, function () {
          _getSessionInitCbsIng = false
        }, o])
        if (_getSessionInitCbsIng !== true) {
          isRun = true
          _getSessionInitCbsIng = true
        }
      } else {
        reject(new Error('Neither a browser nor req and res'))
      }
      if (isRun) {
        session._initRun(o).then(function () {
          // 批量回调成功
          var cbt
          if (o && o.req && o.req._getSessionInitCbs) {
            while ((cbt = o.req._getSessionInitCbs.shift())) {
              if (cbt && cbt[0] && cbt[2] && util.isFunction(cbt[0])) {
                cbt[0](cbt[2])
              }
              cbt = void 0
            }
          } else if (session.isClientWindow && getSessionInitCbs) {
            while ((cbt = getSessionInitCbs.shift())) {
              if (cbt && cbt[0] && cbt[2] && util.isFunction(cbt[0])) {
                cbt[0](cbt[2])
              }
              cbt = void 0
            }
          }
          o = void 0
        }).catch(function (e) {
          // 批量回调异常
          var cbt
          if (o && o.req && o.req._getSessionInitCbs) {
            while ((cbt = o.req._getSessionInitCbs.shift())) {
              if (cbt && cbt[1] && util.isFunction(cbt[1])) {
                cbt[1](e)
              }
              cbt = void 0
            }
          } else if (session.isClientWindow && getSessionInitCbs) {
            while ((cbt = getSessionInitCbs.shift())) {
              if (cbt && cbt[1] && util.isFunction(cbt[1])) {
                cbt[1](e)
              }
              cbt = void 0
            }
          }
          e = o = void 0
        })
      }
      resolve = reject = isRun = void 0
    })
  },
  _initRun: function (o) {
    // 初始化基本参数
    session._initRunBaseInit(o)
    //
    return new Promise(function (resolve, reject) {
      var initTrySum = session.initTrySum || o.initTrySum
      if (o.initTryNum >= initTrySum) {
        reject(new Error('Session initialization failed, exceeding maximum attempted test'))
        return
      } else if (o.initTryNum >= 2) {
        console.log('清理尝试')
      } else {
        resolve(o)
      }
      o = void 0
    }).then(function (o) {
      return session.getData(o)
    }).then(function (o) {
      // 检测设备唯一识别号
      if (o.sessionData && o.sessionData.session_card) {
        return o
      } else {
        return session.createCard(o)
      }
    }).then(function (o) {
      o.request_id = o.request_id || util.createRequestId()

      // 授权字符串
      var authorization = 'session-init-v1'
      authorization += '/' + o.request_id
      authorization += '/' + (o.sessionData.session_id || '0')
      authorization += '/' + o.sessionData.session_card
      authorization += '/' + sign.getUTCServerTime(o.sessionData.difference_time || 0) + '/' + '1800'
      var signingKey = sign.HmacSHA256(authorization, (o.sessionData.session_key || 'session_key'))
      // 生成加密key
      authorization += '/' + util.createGuid()
      authorization += '/' + sign.HmacSHA256(authorization, signingKey)

      o.headers = o.headers || Object.create(null)
      o.headers.Authorization = authorization

      signingKey = authorization = void 0
      return o
    }).then(function (o) {
      // 请求方式
      o.method = o.method || 'GET'
      o.path = o.path || session.sessionInitPath || '/session/init'
      o.serverRes = Object.create(null)
      o.serverRes.statusCode = 0
      o.serverRes.status = 'UNKNOW_ERROR'
      o.serverRes.body = ''
      // 返回一个请求
      return request(o)
    }).then(function (o) {
      return new Promise(function (resolve, reject) {
        var r = null
        var e = null
        var res = o.serverRes
        try {
          r = JSON.parse(res.body)
        } catch (e1) {
          e = e1
        }
        if (e) {
          e.statusCode = res.statusCode
          e.error_id = res.status
          e.message = res.status || 'Unknow Error'
          reject(e)
        } else if (r) {
          if (r.state) {
            r.statusCode = r.statusCode || r.code || res.statusCode
            r.error_id = r.error_id || res.status
            r.message = r.message || r.msg || res.status || 'Unknow Error'
            o._serverResObj = r
            resolve(o)
          } else {
            e = new Error(r.message || r.msg || res.status || 'Unknow Error')
            e.statusCode = r.statusCode || r.code || res.statusCode
            e.error_id = r.error_id || res.status
            e.message = r.message || r.msg || res.status || 'Unknow Error'
            reject(e)
          }
        }
        o.destroy()
        o = resolve = reject = r = e = res = void 0
      })
    }).then(function (o) {
      return new Promise(function (resolve, reject) {
        var res = o._serverResObj

        if (res.type !== 'update') {
          // 如果不需要更新就跳过
          resolve(o)
          return
        }
        var sessionData = res.session_data
        // 服务器时间
        sessionData.server_time = sessionData.server_time || util.time()
        // 本地时间
        sessionData.local_time = util.time()
        // 服务器时间减去本地时间
        sessionData.difference_time = sessionData.server_time - sessionData.local_time
        // 到期时间

        if (sessionData.expires_time !== undefined && sessionData.expires_time !== null) {
          sessionData.expires_time += sessionData.difference_time
        } else {
          sessionData.expires_time = util.time() + (60 * 60 * 24 * 7)
        }
        // 获取会话数据
        session.setData(o, JSON.stringify(sessionData)).then(resolve).catch(reject)
      })
    })
  },
  createCard: function (o) {
    return new Promise(function (resolve, reject) {
      o.sessionData = o.sessionData || Object.create(null)
      o.sessionData.session_card = 'ed9a-d251b2e6-48c3-9c08-e426-ed15398ac305-73624bb2'
      resolve(o)
      // reject('ed9a-d251b2e6-48c3-9c08-e426-ed15398ac305-73624bb2');
    })
  },
  _initRunBaseInit: function (o) {
    // 默认0次参数
    o.initTryNum = o.initTryNum || 0
    // 默认0次参数
    o.initTrySum = o.initTrySum || session.initTrySum || 3
    // url
    o.baseUrl = o.baseUrl || api.baseUrl || ''
    o.req = o.req || null
    o.res = o.res || null
    // 是否在node服务器运行
    o.isServerNode = (o.isServerNode !== void 0) ? o.isServerNode : Boolean(o.req && o.res)
    // 获取基本信息
    o.host = o.host || url('hostname', o.baseUrl)
    o.port = o.port || url('port', o.baseUrl)
    o.protocol = o.protocol || url('protocol', o.baseUrl)
  },
  // 获取正确的会话数据
  getTrueData: function (o) {
    return new Promise(function (resolve, reject) {
      var isRun = false
      // 处理回调
      if (o.isServerNode) {
        o.req._getSessionTrueDataCbs = o.req._getSessionTrueDataCbs || []
        // 服务端-处理同一请求多次初始化会话的问题，同一回调
        o.req._getSessionTrueDataCbs.push([resolve, reject, o])
        o.req._getSessionTrueDataCbs.push([function () {
          if (this && this.req) {
            this.req._getSessionTrueDataCbsIng = false
          }
        }.bind(o), function () {
          if (this && this.req) {
            this.req._getSessionTrueDataCbsIng = false
          }
        }.bind(o), o])
        if (o.req._getSessionTrueDataCbsIng !== true) {
          isRun = true
          o.req._getSessionTrueDataCbsIng = true
        }
      } else if (session.isClientWindow) {
        // 浏览器-处理同一请求多次初始化会话的问题，同一回调
        getSessionTrueCbs.push([resolve, reject, o])
        getSessionTrueCbs.push([function () {
          _getSessionTrueDataCbsIng = false
        }, function () {
          _getSessionTrueDataCbsIng = false
        }, o])
        if (_getSessionTrueDataCbsIng !== true) {
          isRun = true
          _getSessionTrueDataCbsIng = true
        }
      } else {
        reject(new Error('Neither a browser nor req and res'))
      }
      if (isRun) {
        session._getTrueDataRun(o)
      }
      resolve = reject = o = isRun = void 0
    })
  },
  // 获取正确的会话数据-开始运行
  _getTrueDataRun: function (o) {
    var sessionO = {
      req: o.req || null,
      res: o.res || null,
      host: o.host,
      port: o.port,
      baseUrl: o.baseUrl,
      protocol: o.protocol,
      isServerNode: o.isServerNode,
      cookieName: o.cookieName,
      cookieNameEnCode: o.cookieNameEnCode,
      isSessionInit: o.isSessionInit,
      isSessionDataPass: o.isSessionDataPass,
      sessionData: o.sessionData,
      sessionDataStr: o.sessionDataStr,
      sessionDataOldStr: o.sessionDataOldStr
    }
    var keys = Object.keys(sessionO)
    session.getData(sessionO).then(function (o) {
      // 检测会话是否过期
      return new Promise(function (resolve, reject) {
        var isSessionDataPass = true
          // o.isSessionInit 是否强制
        isSessionDataPass = isSessionDataPass && (!o.isSessionInit)
          // 基本需要的数据检测
        isSessionDataPass = isSessionDataPass && o.sessionData && o.sessionData.session_id && o.sessionData.session_key && o.sessionData.session_card
          // 检测事件
        isSessionDataPass = isSessionDataPass && o.sessionData.expires_time && util.time() < (o.sessionData.expires_time - 5)
        // 为了保证没有问题，提前5秒钟过期
        if (isSessionDataPass) {
          // 下一步
          resolve(o)
          // 回收
          resolve = reject = o = void 0
        } else {
          // 重新初始化
          o.isSessionInit = undefined
          session.init({
            req: o.req || null,
            res: o.res || null,
            host: o.host,
            port: o.port,
            baseUrl: o.baseUrl,
            protocol: o.protocol,
            isServerNode: o.isServerNode
          }).then(function () {
            if (typeof resolve === 'function') {
              session.getData(o).then(resolve).catch(reject)
            }
            resolve = reject = o = void 0
          }).catch(function (e) {
            if (typeof reject === 'function') {
              reject(e)
            }
            resolve = reject = o = void 0
          })
        }
      })
    }).then(function () {
      // 批量回调成功
      var cbt
      if (sessionO.req && sessionO.req._getSessionTrueDataCbs) {
        while ((cbt = sessionO.req._getSessionTrueDataCbs.shift())) {
          if (cbt && cbt[0] && cbt[2] && util.isFunction(cbt[0])) {
            util.copyObjByKey(cbt[2], sessionO, keys)
            cbt[0](cbt[2])
          }
          cbt = void 0
        }
      } else if (session.isClientWindow && getSessionTrueCbs) {
        while ((cbt = getSessionTrueCbs.shift())) {
          if (cbt && cbt[0] && cbt[2] && util.isFunction(cbt[0])) {
            util.copyObjByKey(cbt[2], sessionO, keys)
            cbt[0](cbt[2])
          }
          cbt = void 0
        }
      }
      sessionO = void 0
    }).catch(function (e) {
      // 批量回调异常
      var cbt
      if (sessionO.req && sessionO.req._getSessionTrueDataCbs) {
        while ((cbt = sessionO.req._getSessionTrueDataCbs.shift())) {
          if (cbt && cbt[1] && util.isFunction(cbt[1])) {
            cbt[1](e)
          }
          cbt = void 0
        }
      } else if (session.isClientWindow && getSessionTrueCbs) {
        while ((cbt = getSessionTrueCbs.shift())) {
          if (cbt && cbt[1] && util.isFunction(cbt[1])) {
            cbt[1](e)
          }
          cbt = void 0
        }
      }
      e = sessionO = void 0
    })
    o = void 0
  },
  setData: function (o, sessionData) {
    return new Promise(function (resolve, reject) {
      if (!o.cookieName) {
        // 根据host和port生成cookieName
        o.cookieName = o.host + (o.port ? (':' + o.port) : '')
      }
      // 编码cookieName
      o.cookieNameEnCode = session._cookieNameEnCode(o.cookieName)
      if (o.isServerNode) {
        // 服务器模式
        session._setDataNode(o, sessionData, resolve, reject)
      } else if (session.isClientWindow) {
        // 客户端
        session._setDataClient(o, sessionData, resolve, reject)
      } else {
        // 不确定是什么浏览器
        reject(new Error('Neither a browser nor req and res'))
      }
      resolve = reject = o = void 0
    })
  },
  getData: function (o) {
    return new Promise(function (resolve, reject) {
      if (!o.cookieName) {
        // 根据host和port生成cookieName
        o.cookieName = o.host + (o.port ? (':' + o.port) : '')
      }
      // 编码cookieName
      o.cookieNameEnCode = session._cookieNameEnCode(o.cookieName)
      if (o.isServerNode) {
        // 服务器模式
        session._getDataNode(o, resolve, reject)
      } else if (session.isClientWindow) {
        // 客户端
        session._getDataClient(o, resolve, reject)
      } else {
        // 不确定是什么浏览器
        reject(new Error('Neither a browser nor req and res'))
      }
      resolve = reject = o = void 0
    }).then(function (o) {
      // 反序列化会话数据
      return new Promise(function (resolve, reject) {
        if (o.sessionDataStr && typeof o.sessionDataStr === 'string') {
          try {
            o.sessionData = JSON.parse(o.sessionDataStr)
          } catch (e) {
            o.sessionData = o.sessionData || Object.create(null)
          }
        } else {
          o.sessionData = o.sessionData || Object.create(null)
        }
        // 清理
        delete o.sessionDataStr
        // 序列化用于后期比对
        o.sessionDataOldStr = session.arrayToStr(o.sessionData)
        // 回调下一步
        resolve(o)
      })
    })
  },
  // node服务端获取
  _getDataNode: function (o, resolve, reject) {
    var cookiename
    try {
      cookiename = o.cookieNameEnCode
      o.sessionDataStr = (o.res && o.res.cookieDdvRestfulApiStr) || session._getCookiesServer(cookiename, o.req) || o.sessionDataStr
      // 本地存储模块
      if (util.isFunction(resolve)) {
        resolve(o)
      }
    } catch (e) {
      if (util.isFunction(reject)) {
        reject(e)
      }
    }
    resolve = reject = o = void 0
  },
  // 客户端获取
  _setDataNode: function (o, data, resolve, reject) {
    if (!(o && o.res)) {
      reject(new Error('Your browser does not support cookies and localStorage'))
      return
    }
    if (!o.cookieNameEnCode) {
      reject(new Error('Deceased cookie surname'))
      return
    }
    var cookiename = o.cookieNameEnCode
    o.res.cookieDdvRestfulApiStr = data
    try {
      // 本地存储模块
      if (session.isLongStorage) {
        session._setCookiesServer(o.req, o.res, cookiename, data)
      } else {
        session._setCookiesServer(o.req, o.res, cookiename, data, session.getExpiresDate('365', '12', '60'))
      }

      if (util.isFunction(resolve)) {
        resolve(o)
      }
    } catch (e) {
      if (util.isFunction(reject)) {
        reject(e)
      }
    }
    resolve = reject = data = o = void 0
  },
  // 设置cookies
  _getCookiesServer: function (key, req) {
    if (req) {
      return (req.cookies && req.cookies[key]) || session._getCookiesByStr(key, (req.headers && req.headers.cookie || '')) || ''
    } else {
      return ''
    }
  },
  // 设置cookies
  _setCookiesServer: function (req, res, key, value, expires, path, domain, isSecure) {
    var t
    if (!res) {
      return
    }
    if (util.isFunction(res.cookie)) {
      t = { domain: domain || '', path: path || '/', secure: Boolean(isSecure) }
      if (t.domain) {
        delete t.domain
      }
      if (t.secure) {
        delete t.secure
      }
      if (expires) {
        t.expires = new Date(expires)
      }
      res.cookie(key, value, t)
    } else {
      t = ''
      t += (key.toString().trim() + '=')
      t += session.escape(value)
      t += expires ? '; expires=' + expires : ''
      t += (typeof path === 'string' && path !== '') ? ('; path=' + path) : '; path=/'
      t += (typeof domain === 'string' && domain !== '') ? '; domain=' + domain : ''
      t += isSecure ? '; secure' : ''
      if (req.headers && req.headers.cookie) {
        req.headers.cookie = t
      }
      // 强制一个数组
      res.cookiesSetArray = res.cookiesSetArray || []
      // 加入输出数组
      res.cookiesSetArray.push(t)
      // 设置输出头
      res.setHeader('Set-Cookie', res.cookiesSetArray)
    }
    t = void 0
  },
  // 客户端获取
  _getDataClient: function (o, resolve, reject) {
    var cookiename, data
    if (!(session.isLocalCookie || session.isLocalStorage || session.isSessionStorage)) {
      reject(new Error('Your browser does not support cookies and localStorage'))
      return
    }
    try {
      cookiename = o.cookieNameEnCode
      data = session._getCookiesClient(cookiename) || null
      // 本地存储模块
      if (!data) {
        try {
          if (session.isLongStorage) {
            // 长期存储模式
            data = localStorage.getItem(cookiename) || null
            session._setCookiesClient(cookiename, data)
          } else {
            // 会话形式
            data = sessionStorage.getItem(cookiename) || null
            session._setCookiesClient(cookiename, data, session.getExpiresDate('365', '12', '60'))
          }
        } catch (e) {
          data = null
        }
      }
      o.sessionDataStr = data || o.sessionDataStr
      if (typeof resolve === 'function') {
        resolve(o)
      }
    } catch (e) {
      if (typeof reject === 'function') {
        reject(e)
      }
    }
    resolve = reject = data = o = void 0
  },
  // 客户端获取
  _setDataClient: function (o, data, resolve, reject) {
    var cookiename
    if (!(session.isLocalCookie || session.isLocalStorage || session.isSessionStorage)) {
      reject(new Error('Your browser does not support cookies and localStorage'))
      return
    }
    try {
      cookiename = o.cookieNameEnCode
      // 本地存储模块
      if (session.isLongStorage) {
        // 长期存储模式
        if (session.isLocalStorage) {
          localStorage.setItem(cookiename, data)
        }
        session._setCookiesClient(cookiename, data)
      } else {
        // 会话形式
        if (session.isSessionStorage) {
          sessionStorage.setItem(cookiename, data)
        }
        session._setCookiesClient(cookiename, data, session.getExpiresDate('365', '12', '60'))
      }

      if (util.isFunction(resolve)) {
        resolve(o)
      }
    } catch (e) {
      if (util.isFunction(reject)) {
        reject(e)
      }
    }
    resolve = reject = data = o = void 0
  },
  // 客户端读取
  _getCookiesClient: function (key) {
    if (session.isLocalCookie) {
      return session._getCookiesByStr(key, document.cookie)
    } else {
      return ''
    }
  },
  // 客户端存储
  _setCookiesClient: function (key, value, expires, path, domain, isSecure) {
    var t
    key = (key || '').toString().trim()
    try {
      if (VS_COOKIEDM !== undefined && VS_COOKIEDM !== null && !domain) {
        domain = VS_COOKIEDM
      }
    } catch (e) {}
    t = ''
    t += (key.toString().trim() + '=')
    t += session.escape(value)
    t += expires ? '; expires=' + expires : ''
    t += (typeof path === 'string' && path !== '') ? ('; path=' + path) : '; path=/'
    t += (typeof domain === 'string' && domain !== '') ? '; domain=' + domain : ''
    t += isSecure ? '; secure' : ''
    document.cookie = t
    t = void 0
  },
  _cookieNameEnCode: function (name) {
    name = cryptoJsCore.enc.Utf8.parse((name || 'sid').toString() || '').toString(cryptoJsBase64)
    name = name.replace(/_/g, '____').replace(/\+/g, '___').replace(/\//g, '__').replace(/=/g, '_')
    return name
  },
  // 数组序列化
  _getCookiesByStr: function (key, str) {
    var value = '';
    ((str || '').split(';') || []).forEach(function (t, i) {
      var a = (t || '').split('=') || []
      if ((a[0] || '').toString().trim() === key) {
        value = session.unescape((a[1] || '').toString().trim())
      }
      a = t = i = void 0
    })
    return value
  },
  // 数组序列化
  arrayToStr: function (obj) {
    var a = []
    var name
    for (name in obj) {
      if (!Object.hasOwnProperty.call(obj, name)) {
        continue
      }
      a.push(name + '=' + obj[name])
    }
    name = void 0
    a.sort()
    obj = void 0
    a = a.join(';')
    return a
  },
  // 获取GMT格式的过期时间
  getExpiresDate: function (days, hours, minutes, seconds) {
    var ExpiresDate = new Date()
    if (util.isNumber(days) && util.isNumber(hours) && util.isNumber(minutes)) {
      ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days))
      ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours))
      ExpiresDate.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes))
      if (util.isNumber(seconds)) {
        ExpiresDate.setSeconds(ExpiresDate.getSeconds() + parseInt(seconds))
      }
    }
    return ExpiresDate.toGMTString()
  }
})

// 局部变量-是否为客户端窗口
session.isClientWindow = typeof window !== 'undefined' && window.window === window && typeof window.document !== 'undefined'
// 局部变量-本地cookie是否为客户端窗口支持
session.isLocalCookie = false
// 局部变量-本地存储是否为客户端窗口支持
session.isLocalStorage = false
// 局部变量-本地会话存储是否为客户端窗口支持
session.isSessionStorage = false
session.isLongStorage = false
session.sessionInitPath = '/session/init'
if (session.isClientWindow) {
  try {
    session.isLocalCookie = 'cookie' in window.document
  } catch (e) {}
  try {
    session.isLocalStorage = 'localStorage' in window
  } catch (e) {}
  try {
    session.isSessionStorage = 'sessionStorage' in window
  } catch (e) {}
}

function session () {

}

