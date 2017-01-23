'use strict'
// 导出签名模块
const sign = module.exports = Object.assign(function sign (o) {
  return sign._signRun(o)
}, {
  headersPrefix: 'x-ddv-',
  excludeHeaderKeys: ['host', 'content-length', 'content-type', 'content-md5'],
  // 签名头
  _signRun (o) {
    return new api.Promise(function signInit (resolve, reject) {
      // base初始化
      sign._signRunBaseInit(o)
      // 初始化GET参数
      sign._signRunQueryInit(o)
      // 格式化头信息
      sign._signRunHeadersFormat(o)
      // 签名头排序
      sign._signRunHeadersSort(o)
      // 提交下一步
      resolve(o)
      o = void 0
    }).then(function (o) {
      // 获取校验过的session数据
      return session.getTrueData(o)
    }).then(function (o) {
      // 会话id
      var sessionId = o.sessionData.session_id
      // 会话秘钥
      var sessionKey = o.sessionData.session_key || 'session_key'
      // 设备识别号
      var sessionCard = o.sessionData.session_card
      // 时间差
      var differenceTime = o.sessionData.difference_time

      // 授权字符串
      o.Authorization = 'app-auth-v2' + '/' + o.request_id + '/' + sessionId + '/' + sessionCard + '/' + sign.getUTCServerTime(differenceTime) + '/' + '1800'
      // 生成临时秘钥-用于加密的key-防止丢失正式key
      var signingKey = sign.HmacSHA256(o.Authorization, sessionKey)

      // 拼接内容
      var canonicalRequest = o.method + o.n + request.urlEncodeExceptSlash(o.path) + o.n + o.query + o.n + o.authCanonicalHeadersStr
      // 使用signKey和标准请求串完成签名
      var sessionSign = sign.HmacSHA256(canonicalRequest, signingKey)
      // 组成最终签名串
      o.Authorization += '/' + o.authHeadersStr + '/' + sessionSign
      // 进入下一步
      return o
    }).then(function (o) {
      if (!o.headers) {
        o.headers = Object.create(null)
      }
      o.headers['Authorization'] = o.Authorization
      // 回收数据
      delete o.authHeadersStr
      delete o.authCanonicalHeadersStr
      return o
    })
  },
  // 签名头排序
  _signRunHeadersSort (o) {
    // 要签名的头的key的一个数组
    o.authHeadersStr = []
    // 签名的头
    o.authCanonicalHeadersStr = []

    o.headersPrefix = o.headersPrefix || sign.headersPrefix || request.headersPrefix
    o.headersPrefixLen = o.headersPrefix.length
    var keyLower, key, value
    var headersOld = o.headers
    for (key in headersOld) {
      if (!Object.hasOwnProperty.call(headersOld, key)) {
        continue
      }
      // 取得key对应的value
      value = headersOld[key]
      // 小写的key
      keyLower = key.toLowerCase()
      // 判断一下
      if (sign.excludeHeaderKeys.indexOf(keyLower) > -1 || keyLower.substr(0, o.headersPrefixLen) === o.headersPrefix) {
        o.authCanonicalHeadersStr.push(request.urlEncode(keyLower) + ':' + request.urlEncode(value))
        o.authHeadersStr.push(keyLower)
      }
    }

    // 排序
    o.authCanonicalHeadersStr.sort()
    // 用\n拼接
    o.authCanonicalHeadersStr = o.authCanonicalHeadersStr.join(o.n)
    // 用;拼接
    o.authHeadersStr = o.authHeadersStr.join(';')
  },
  // 格式化头信息
  _signRunHeadersFormat (o) {
    // 克隆
    var headersTemp = Object.create(null)
    var headersOld = o.headers
    var value = ''
    var key = ''
    // 遍历头
    for (key in headersOld) {
      // 去左右空格
      key = sign._trim(key)
      value = sign._trim(headersOld[key])
      switch (key.toLowerCase()) {
        case 'authorization':
          continue
        case 'host':
          key = 'Host'
          break
        case 'content-length':
          key = 'Content-Length'
          break
        case 'content-type':
          key = 'Content-Type'
          break
        case 'content-md5':
          key = 'Content-Md5'
          break
      }
      if (value) {
        headersTemp[key] = value
      }
    }
    // 把处理后的赋值回给
    o.headers = headersTemp
    // 释放内存
    headersTemp = headersOld = key = value = void 0
    // 强制有host头
    o.headers.Host = o.headers.Host ? o.headers.Host : o.host

    if (o.body && o.body.length > 0) {
      o.headers['Content-Length'] = o.headers['Content-Length'] ? o.headers['Content-Length'] : o.body.length
      o.headers['Content-Type'] = o.headers['Content-Type'] ? o.headers['Content-Type'] : 'application/x-www-form-urlencoded; charset=UTF-8'
      o.headers['Content-Md5'] = sign.md5Base64(o.body)
    }
  },
  // 初始化GET参数
  _signRunQueryInit (o) {
    // 签名数组
    let queryArray = []
    if (o.query && o.query.length > 0) {
      o.query.split('&').forEach(function (t) {
        if (!t) {
          return
        }
        var key, value, i
          // 找到第一个等号的首次出现位置
        i = t.indexOf('=')
          // 取得key
        key = t.substr(0, i)
          // 取得value
        value = t.substr(i + 1)
          // 先去左右空格再编码
        key = sign._trim(key)
        value = sign._trim(value)
          // 插入新数组
        queryArray.push(key + '=' + value)
      })
    }
    // 排序
    queryArray.sort()
    // 用&拼接
    o.query = queryArray.join('&')
    // 回收内存
    queryArray = void 0
  },
  // base初始化
  _signRunBaseInit (o) {
    // 默认换行
    o.n = o.n || '\n'
    // 请求id
    o.request_id = o.request_id || request.createRequestId()
    // 请求方式
    o.method = (o.method || 'GET').toString().toUpperCase()
    // 强制是字符串
    o.query = o.query || ''
    // get请求
    if (o.method.toLowerCase() === 'GET') {
      // 如果有请求体
      if (o.body) {
        // 拼接到query中
        o.query += o.query ? '&' : ''
        // 清空请求体
        o.body = ''
      }
    } else {
      o.body = o.body || ''
    }
  },
  getUTCServerTime (differenceTime) {
    var d
    d = new Date()
    d = new Date(parseInt(d.getTime() + ((parseInt(differenceTime) || 0) * 1000)) + (60 * d.getTimezoneOffset()))
    return d.getUTCFullYear() + '-' + sign._replenish((d.getUTCMonth() + 1), 2) + '-' + sign._replenish((d.getUTCDate()), 2) + 'T' + sign._replenish((d.getUTCHours()), 2) + ':' + sign._replenish((d.getUTCMinutes()), 2) + ':' + sign._replenish((d.getUTCSeconds()), 2) + 'Z'
  },
  _replenish (text, total, rstr) {
    text = text.toString()
    var rstrlen = (total - text.length) || 0
    var rstri = 0
    var r = text
    switch (arguments.length) {
      case 3:
        break
      case 2:
        rstr = '0'
        break
      default:
        return r
    }
    for (rstri = 0; rstri < rstrlen; rstri++) {
      r = rstr.toString() + r.toString()
    }
    return r
  },
  _trim (str) {
    return str.toString().trim()
  },
  md5Hex (str, isToString) {
    str = str || ''
    if (isToString !== false) {
      str = str.toString()
    }
    return cryptoJsCore.MD5(str).toString(cryptoJsHex)
  },
  md5Base64 (str, isToString) {
    str = str || ''
    if (isToString !== false) {
      str = str.toString()
    }
    return cryptoJsCore.MD5(str).toString(cryptoJsBase64)
  },
  HmacSHA256 (str, key, isToString) {
    str = str || ''
    if (isToString !== false) {
      str = str.toString()
    }
    return cryptoJsCore.HmacSHA256(str, key).toString(cryptoJsHex)
  }
})
// 引入签名会话模块
// 引入请求模块
const api = require('./api.js')
const request = require('./request.js')
const session = require('./session.js')
const cryptoJsCore = require('crypto-js/core')
// const cryptoJsMd5 =
require('crypto-js/md5')
// const cryptoJsHmacSha256 =
require('crypto-js/hmac-sha256')
const cryptoJsBase64 = require('crypto-js/enc-base64')
const cryptoJsHex = require('crypto-js/enc-hex')
