// 工具
var util = require('../util')

var ddvRestFulApiPrototype = {
  // 发送别名
  send: function sendData (input) {
    this.sendData && Object.assign(this.sendData, input || Object.create(null))
    return this
  },
  sendValidData: function sendValidData (input) {
    var obj = Object.create(null)
    var key
    for (key in input) {
      if (input.hasOwnProperty(key) && (input[key] || input[key] === 0)) {
        obj[key] = input[key]
      }
    }
    return this.send(obj)
  },
  native: function () {
    this.isNative = true
    return this
  },
  setJsonBody: function (flag) {
    this.isJsonBody = !!flag
    return this
  },
  path: function path (input) {
    this.auth && this.auth.setPath(input || '/')
    return this
  },
  method: function method (input) {
    this.auth && this.auth.setMethod(input)
    return this
  },
  setUri: function setUri (input) {
    this.auth && this.auth.setUri(input)
    return this
  },
  query: function query (input, isClean) {
    this.auth && this.auth.setQuery(input, isClean)
    return this
  },
  headers: function headers (input, isClean) {
    this.auth && this.auth.setHeaders(input, isClean)
    return this
  },
  // 成功别名
  success: function success (fn) {
    return this.then && this.then.apply(this, util.argsToArray(arguments))
  },
  // 错误别名
  error: function error (fn) {
    return this.catch && this.catch.apply(this, util.argsToArray(arguments))
  },
  // 失败别名
  fail: function fail (fn) {
    return this.catch && this.catch.apply(this, util.argsToArray(arguments))
  },
  setOnAccessKey: function setOnAccessKey (fn) {
    this.onAccessKey = fn
    return this
  },
  setIsAuth: function setIsAuth (isAuth) {
    this.isAuth = isAuth
    return this
  },
  req: function requests (input) {
    this.requests = input || this.requests || null
    return this
  },
  res: function response (input) {
    this.response = input || this.response || null
    return this
  },
  context: function context (input) {
    if (input.req && input.res) {
      this.req && this.req(input.req)
      this.res && this.res(input.res)
    } else if (input.requests && input.response) {
      this.req && this.req(input.requests)
      this.res && this.res(input.response)
    }
    return this
  },
  // 销毁
  destroy: function destroy () {
    util.nextTick.call(this, function () {
      var key
      if (this) {
        if (this.protoExtend) {
          for (key in this) {
            if (!Object.hasOwnProperty.call(this, key)) continue
            if (!Object.hasOwnProperty.call(this.protoExtend, key)) continue
            delete this[key]
          }
        }
        for (key in this) {
          if (!Object.hasOwnProperty.call(this, key)) continue
          if (!Object.hasOwnProperty.call(ddvRestFulApiPrototype, key)) continue
          delete this[key]
        }
      }
      key = void 0
    })
  },
  apiStartStack: '',
  auth: void 0,
  isAuth: true,
  sendData: void 0,
  request: void 0,
  requests: void 0,
  response: void 0,
  onAccessKey: void 0,
  protoExtend: void 0
}
// 发送别名
ddvRestFulApiPrototype.sendData = ddvRestFulApiPrototype.send

module.exports = ddvRestFulApiPrototype
