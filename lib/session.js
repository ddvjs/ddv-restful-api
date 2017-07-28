/* global localStorage sessionStorage VS_COOKIEDM */
// 导出 session 模块
module.exports = session
var util = require('../util')
var url = require('ddv-auth/util/url')
var sign = require('ddv-auth/util/sign')
var parseDataByBody = require('./parseDataByBody.js')
var time = require('ddv-auth/util/time')
// 请求模块
var request = require('./request.js')

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
Object.assign(session, {
  getTrueData: function getTrueData (sessionInitUrl, requests, response, tryNum) {
    var sid = getSidByUrl(sessionInitUrl)
    var queue = getQueue(sid, requests)
    var promise = new Promise(function (resolve, reject) {
      var isRunIng = (queue && queue.length > 0) || false
      queue.push([resolve, reject, this])
      isRunIng || getTrueDataRun(sid, sessionInitUrl, queue, requests, response, tryNum)
      sid = requests = response = tryNum = queue = resolve = reject = void 0
    }.bind(this))
    return promise
  }
})
function sessionInit (sessionInitUrl, data) {
  var requestId, authorization, signingKey
  requestId = util.createRequestId()
  // 授权字符串
  authorization = 'session-init-v1'
  authorization += '/' + requestId
  authorization += '/' + (data.sessionId || '0')
  authorization += '/' + data.sessionCard
  authorization += '/' + session.getUTCServerTime(data.differenceTime || 0) + '/' + '1800'
  signingKey = sign.HmacSHA256(authorization, (data.sessionKey || 'sessionKey'))
  // 生成加密key
  authorization += '/' + util.createGuid()
  authorization += '/' + sign.HmacSHA256(authorization, signingKey)

  // 返回一个请求
  return request(sessionInitUrl, '', 'GET', {
    Authorization: authorization
  })
  .then(function (res) {
    return parseDataByBody(res)
  }, function (e) {
    return parseDataByBody(e, true)
  })
  .then(function (res) {
    var sessionData
    if (res.type !== 'update') {
      // 如果不需要更新就跳过
      return data
    }
    sessionData = res.sessionData
    // 服务器时间
    sessionData.serverTime = sessionData.serverTime || util.time()
    // 本地时间
    sessionData.localTime = util.time()
    // 服务器时间减去本地时间
    sessionData.differenceTime = sessionData.serverTime - sessionData.localTime
    // 到期时间

    if (sessionData.expiresTime !== void 0 && sessionData.expiresTime !== null) {
      sessionData.expiresTime += sessionData.differenceTime
    } else {
      // 过期时间，现在本地时间推后7天到期
      sessionData.expiresTime = util.time() + (60 * 60 * 24 * 7)
    }
    // 获取会话数据
    return sessionData
  })
  .then(function (res) {
    requestId = authorization = signingKey = sessionInitUrl = data = void 0
    return res
  }, function (e) {
    requestId = authorization = signingKey = sessionInitUrl = data = void 0
    return Promise.reject(e)
  })
}
function getTrueDataRun (sid, sessionInitUrl, queue, requests, response, tryNum) {
  var storage = getStorageObj(sid, requests)
  tryNum = tryNum || 0
  return (
    tryNum !== true && storage.sessionData && parseInt(tryNum) < 1
    ? Promise.resolve(storage.sessionData)
    : session.getData(sid, requests, response)
  )
  .then(function (data) {
    // 基本需要的数据检测，并且错误少于2
    data = (data && data.sessionId && data.sessionKey && data.sessionCard && tryNum !== true && tryNum < 2) ? data : Object.create(null)

    if (data.sessionCard) {
      return data
    } else {
      var userAgent = ''
      if (requests && requests.headers) {
        userAgent = requests.headers['user-agent'] || requests.headers['User-Agent'] || requests.headers['userAgent'] || requests.headers['useragent'] || userAgent
      }
      if (session.isClientWindow && window.navigator) {
        userAgent = userAgent || window.navigator.userAgent || window.navigator.useragent || userAgent
      }
      return session.createCard(userAgent)
      .then(function (sessionCard) {
        var r = data
        data = void 0
        r.sessionCard = sessionCard
        return r
      })
    }
  })
  .then(function (data) {
    if (tryNum !== true && data && data.sessionId && data.sessionKey && data.sessionCard && data.expiresTime && util.time() < (data.expiresTime - 5) && parseInt(tryNum) < 1) {
      return data
    } else {
      return session.init(sessionInitUrl, data)
      .then(function (data) {
        return session.setData(sid, data, requests, response)
        .then(function () {
          var r = data
          // 因为闭包原因，所以特定来解除引用
          data = void 0
          return r
        }, function (e) {
          // 因为闭包原因，所以特定来解除引用
          data = void 0
          return Promise.reject(e)
        })
      })
    }
  })
  .then(function (data) {
    var cbt
    while ((cbt = queue.shift())) {
      if (cbt && cbt[0] && cbt[2] && util.isFunction(cbt[0])) {
        try {
          cbt[0].call(cbt[2], data)
        } catch (e) {}
      }
      cbt = void 0
    }
    sid = sessionInitUrl = queue = requests = response = storage = tryNum = data = void 0
  }, function (e) {
    var cbt
    while ((cbt = queue.shift())) {
      if (cbt && cbt[1] && cbt[2] && util.isFunction(cbt[1])) {
        try {
          cbt[1].call(cbt[2], e)
        } catch (e) {}
      }
      cbt = void 0
    }
    sid = sessionInitUrl = queue = requests = response = storage = tryNum = e = void 0
  })
}
function setData (sid, data, req, res) {
  if (!(session.isClientWindow || (req && res))) {
    return Promise.reject(new Error('Your browser does not support cookies and localStorage'))
  }
  try {
    data = JSON.stringify(data)
  } catch (e) {
    return Promise.reject(e)
  }
  if (req && res) {
    // 保存
    res.cookieDdvRestfulApiStr = data
    try {
      // 本地存储模块
      if (session.isLongStorage) {
        session.setCookiesServer(req, res, sid, data)
      } else {
        session.setCookiesServer(req, res, sid, data, session.getExpiresDate('365', '12', '60'))
      }
    } catch (e) {
      return Promise.reject(e)
    }
  } else {
    if (!(session.isLocalCookie || session.isLocalStorage || session.isSessionStorage)) {
      return Promise.reject(new Error('Your browser does not support cookies and localStorage'))
    }
    try {
      // 本地存储模块
      if (session.isLongStorage) {
        // 长期存储模式
        if (session.isLocalStorage) {
          localStorage.setItem(sid, data)
        }
        session.setCookiesClient(sid, data)
      } else {
        // 会话形式
        if (session.isSessionStorage) {
          sessionStorage.setItem(sid, data)
        }
        session.setCookiesClient(sid, data, session.getExpiresDate('365', '12', '60'))
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }
  return Promise.resolve()
}
function getData (sid, req, res) {
  if (!(session.isClientWindow || (req && res))) {
    return Promise.reject(new Error('Your browser does not support cookies and localStorage'))
  }
  var isSave = false
  var data = ''
  if (req && res) {
    data = res.cookieDdvRestfulApiStr || (req.cookies && req.cookies[sid]) || session.getCookiesByStr(sid, ((req.headers && req.headers.cookie) || '')) || ''
  } else {
    if (session.isLocalCookie) {
      data = session.getCookiesByStr(sid, document.cookie)
    }
    // 本地存储模块
    if (!data) {
      isSave = true
      try {
        if (session.isLongStorage) {
          // 长期存储模式
          data = localStorage.getItem(sid) || null
        } else {
          // 会话形式
          data = sessionStorage.getItem(sid) || null
        }
      } catch (e) {
        data = null
      }
    }
  }
  try {
    if (data && typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (e) {
        data = data || Object.create(null)
      }
    } else {
      data = data || Object.create(null)
    }
  } catch (e) {
    return Promise.reject(e)
  }
  isSave && data && setData(sid, data, req, res).catch(function (e) {})
  return Promise.resolve(data)
}

Object.assign(session, {
  init: sessionInit,
  createCard: createCard,
  getUTCServerTime: getUTCServerTime,
  getData: getData,
  setData: setData,
  getCookiesByStr: getCookiesByStr,
  getExpiresDate: getExpiresDate,
  setCookiesClient: setCookiesClient,
  setCookiesServer: setCookiesServer
})

// 客户端存储
function setCookiesClient (key, value, expires, path, domain, isSecure) {
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
}
// 设置cookies
function setCookiesServer (req, res, key, value, expires, path, domain, isSecure) {
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
}
// 获取GMT格式的过期时间
function getExpiresDate (days, hours, minutes, seconds) {
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
// 数组序列化
function getCookiesByStr (key, str) {
  var value = '';
  ((str || '').split(';') || []).forEach(function (t, i) {
    var a = (t || '').split('=') || []
    if ((a[0] || '').toString().trim() === key) {
      value = session.unescape((a[1] || '').toString().trim())
    }
    a = t = i = void 0
  })
  return value
}
var sessionStorageObj = Object.create(null)
function getStorageObj (sid, requests) {
  var storageObj
  if (requests) {
    storageObj = requests.sessionStorageObj = requests.sessionStorageObj || Object.create(null)
  } else {
    storageObj = sessionStorageObj
  }
  storageObj[sid] = storageObj[sid] || Object.create(null)
  return storageObj[sid]
}
var sessionGetTrueQueueCb = Object.create(null)
// 获取队列
function getQueue (sid, requests) {
  var queueQbj
  if (requests) {
    queueQbj = requests.sessionGetTrueQueueCb = requests.sessionGetTrueQueueCb || Object.create(null)
  } else {
    queueQbj = sessionGetTrueQueueCb
  }
  queueQbj[sid] = queueQbj[sid] || []
  return queueQbj[sid]
}
function getSidByUrl (uri) {
  var obj = url.parse(uri)
  return url.urlEncode((obj.host || '') + (obj.port || ''))
}
function session (sessionInitUrl, requests, response, tryNum) {
  return session.getTrueData(sessionInitUrl, requests, response, tryNum)
}
function getUTCServerTime (differenceTime) {
  var d
  d = new Date()
  d = new Date(parseInt(d.getTime() + ((parseInt(differenceTime) || 0) * 1000)) + (60 * d.getTimezoneOffset()))
  return time.gmdate('Y-m-dTH:i:sZ', parseInt(d.getTime() / 1000))
}
function createCard (userAgent) {
  return new Promise(function (resolve, reject) {
    var sessionCard = ''
    var uamd5 = sign.md5Hex(userAgent)
    sessionCard = uamd5.substr(0, 4)
    sessionCard += '-' + sign.md5Hex((new Date().toString()) + userAgent + sessionCard).substr(4, 8)
    sessionCard += '-' + sign.md5Hex(uamd5 + userAgent).substr(4, 4)
    sessionCard += '-' + sign.md5Hex(uamd5 + userAgent + userAgent).substr(5, 4)
    sessionCard += '-' + sign.md5Hex(uamd5 + sessionCard + uamd5).substr(4, 4)
    sessionCard += '-' + sign.md5Hex((new Date().toString()) + sessionCard + userAgent).substr(2, 12)
    sessionCard += '-' + uamd5.substr(0, 8)
    resolve(sessionCard)
  })
}
