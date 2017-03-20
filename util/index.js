'use strict'
require('es5-shim')
require('es6-shim')
// 导出模块
module.exports = util
// 创建最后总和
var createNewidSumLast = 0
// 创建最后时间
var createNewidTimeLast = 0
// 创建请求id
Object.assign(util, {
  createNewPid: function createNewid (is10) {
    var r
    if (createNewidTimeLast !== util.time()) {
      createNewidTimeLast = util.time()
      createNewidSumLast = 0
    }
    r = createNewidTimeLast.toString() + (++createNewidSumLast).toString()
    // 使用36进制
    if (!is10) {
      r = parseInt(r, 10).toString(36)
    }
    return r
  },
  // 生成guid
  createGuid: function createGuid (s) {
    return (s || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0
      var v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
})

// 生成请求id
Object.assign(util, {
  // 生成请求id
  createRequestId: function createRequestId () {
    var pid, rid, ridLen, ridT, ridNew, i
    // 获取16进制的 pid
    pid = Number(util.createNewPid(true)).toString(16)
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
    rid = util.createGuid(ridNew)
    i = ridNew = ridT = ridLen = pid = void 0
    return rid
  }
})

// 时间工具
Object.assign(util, {
  // 获取当前时间开始
  now: function now () {
    return (new Date()).getTime()
  },
  // 获取php的时间戳
  time: function time () {
    return parseInt(util.now() / 1000)
  }
})

// 基本判断
Object.assign(util, {
  // 判断是一个方法
  isFunction: function isFunction (fn) {
    return typeof fn === 'function'
  },
  // 判断是否为一个数组
  isArray: function isArray () {
    return Array.isArray.apply(this, arguments)
  },
  isNumber: function isNumber (obj) {
    return (typeof obj === 'string' || typeof obj === 'number') && (!util.isArray(obj) && (obj - parseFloat(obj) >= 0))
  },
  // 判断是否一个标准的global
  isGlobal: function isGlobal (obj) {
    return obj !== void 0 && obj === obj.global
  },
  // 类似php里面的inArray
  inArray: function inArray (a, b) {
    if (!util.isArray(b)) {
      return false
    }
    for (var i in b) {
      if (b[i] === a) {
        return true
      }
    }
    return false
  }
})

// 基本工具
Object.assign(util, {
  // 克隆
  clone: function clone (myObj) {
    var i, myNewObj
    if (!(myObj && typeof myObj === 'object')) {
      return myObj
    }
    if (myObj === null || myObj === undefined) {
      return myObj
    }
    myNewObj = ''
    if (Array.isArray(myObj)) {
      myNewObj = []
      for (i = 0; i < myObj.length; i++) {
        myNewObj.push(myObj[i])
      }
    } else if (typeof myObj === 'object') {
      myNewObj = {}
      if (myObj.constructor && myObj.constructor !== Object) {
        myNewObj = myObj
      // 防止克隆ie下克隆  Element 出问题
      } else if (myObj.innerHTML !== undefined && myObj.innerText !== undefined && myObj.tagName !== undefined && myObj.tabIndex !== undefined) {
        myNewObj = myObj
      } else {
        for (i in myObj) {
          myNewObj[i] = clone(myObj[i])
        }
      }
    }
    return myNewObj
  },
  // 复制对象，通过制定key
  copyObjByKey: function copyObjByKey (oldObj, newObj, keys) {
    keys = keys || []
    keys.forEach(function (key) {
      oldObj[key] = newObj[key] || oldObj[key]
    })
  },
  // 设置错误id
  setErrorId: function setErrorId (errorId, error) {
    error.errorId = errorId
    error.error_id = errorId
    return error
  },
  // 参数强转数组
  argsToArray: function argsToArray (args) {
    return Array.prototype.slice.call(args)
  }
})

// nextTick
Object.assign(util, {
  nextTick: require('./nextTick.js')
})

// urlEncode 编码
Object.assign(util, {
  // 编码对照数组表
  kEscapedMap: {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A'
  },
  // 编码
  urlEncode: function urlEncode (string, encodingSlash) {
    var result = encodeURIComponent(string)
    result = result.replace(/[!'()*]/g, function ($1) {
      return util.kEscapedMap[$1]
    })
    if (encodingSlash === false) {
      result = result.replace(/%2F/gi, '/')
    }
    return result
  },
  // path编码
  urlEncodeExceptSlash: function urlEncodeExceptSlash (value) {
    return util.urlEncode(value, false)
  }
})
// 对象序列化
Object.assign(util, {
  // 编码
  buildParams: function buildParams (data, isQuery) {
    var r = util._buildParamsToArray(data, '').join('&')
    if (isQuery) {
      r = r.replace(/%20/gi, '+')
    }
    return r
  },

  _buildParamsToArray: function _buildParamsToArray (data, prefix) {
    var r = []
    var i, key, keyt, value
    if (typeof data === 'object') {
      // 数组
      if (util.isArray(data)) {
        for (i = 0; i < data.length; i++) {
          // 值
          value = data[i]
          // 键
          keyt = util._buildParamsAddPrefix(i, prefix, (typeof value === 'object'))
          // 递归处理对象和数组
          if (typeof value === 'object') {
            // 插入数组
            r.push.apply(r, util._buildParamsToArray(value, keyt))
          } else {
            // 插入数组
            r.push(util.urlEncode(keyt) + '=' + util.urlEncode(value))
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
          keyt = util._buildParamsAddPrefix(key, prefix)
          if (typeof value === 'object') {
            // 插入数组
            r.push.apply(r, util._buildParamsToArray(value, keyt))
          } else {
            // 插入数组
            r.push(util.urlEncode(keyt) + '=' + util.urlEncode(value))
          }
        }
      }
    }
    return r
  },
  _buildParamsAddPrefix: function _buildParamsAddPrefix (key, prefix, isNotArray) {
    if (prefix) {
      return prefix + '[' + (isNotArray !== false ? key : '') + ']'
    } else {
      return key
    }
  }
})

function util () {

}
