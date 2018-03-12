module.exports = AutoRetry
var util = require('../util')
function AutoRetry () {
  if (this instanceof AutoRetry) {
    this.constructor()
  } else {
    return new AutoRetry()
  }
}
var AutoRetryPro = AutoRetry.prototype = Object.create(null)
Object.assign(AutoRetryPro, {
  onThenEmits: null,
  onCatchEmits: null,
  onBeginEmits: null,
  constructor: function constructor () {
    this.onThenEmits = []
    this.onCatchEmits = []
    this.onBeginEmits = []
  },
  autoRetry: function autoRetry (runPromise, options) {
    return this.emitBegin()
    .then(function () {
      if (!util.isFunction(runPromise)) {
        var e = new Error('Your parameter must be a function that returns a Promise')
        e.errorId = 'AUTO_RETRY_ERROR'
        return this.emitCatch(e, runPromise, options)
      }
    }.bind(this))
    .then(function () {
      return this.autoRetryRun(runPromise)
      .then(function thenCb (res) {
        return this.emitThen(res, runPromise, options)
      }.bind(this), function catchCb (e) {
        return this.emitCatch(e, runPromise, options)
      }.bind(this))
    }.bind(this))
  },
  autoRetryRun: function autoRetryRun (runPromise) {
    var data = Object.create(null)
    var _promise = runPromise(data, function (inputData) {
      if (data && inputData && typeof inputData === 'object') {
        Object.assign(data, inputData)
      }
    })
    if (_promise && util.isFunction(_promise.then)) {
      return _promise.then(function resData (res) {
        // 如果没有return数据就返回一个data
        res = res === void 0 ? data : res
        data = void 0
        return res
      })
    } else {
      data = void 0
      var e = new Error('Must return a promise')
      e.errorId = 'NOT_IS_PROMISE'
      return Promise.reject(e)
    }
  },
  // 触发
  emitThen: function emitThen (res, runPromise, options, i) {
    var fn, fnRes
    i = i || 0
    if (Array.isArray(this.onThenEmits) && (fn = this.onThenEmits[i]) && util.isFunction(fn)) {
      return new Promise(function (resolve, reject) {
        try {
          fnRes = fn(res, options, this.onThenEmits.length)
        } catch (e) {
          reject(e)
        }
        if (fnRes && fnRes.then) {
          return fnRes.then(resolve, reject)
        } else {
          resolve(fnRes)
        }
      }.bind(this)).then(function (res) {
        return this.emitThen(res, runPromise, options, ++i)
      }.bind(this), function (e) {
        return this.emitCatch(e, runPromise, options)
      }.bind(this))
    } else {
      return Promise.resolve(res)
    }
  },
  // 触发开始
  emitBegin: function emitBegin () {
    var _promises, res
    _promises = []
    Array.isArray(this.onBeginEmits) && this.onBeginEmits.forEach(function (fn) {
      util.isFunction(fn) && _promises.push(fn())
    })
    res = Promise.all(_promises)
    _promises = void 0
    return res
  },
  // 触发异常
  emitCatch: function emitCatch (e, runPromise, options, i) {
    var fn, fnRes
    i = i || 0
    if (Array.isArray(this.onCatchEmits) && (fn = this.onCatchEmits[i]) && util.isFunction(fn)) {
      return new Promise(function (resolve, reject) {
        try {
          fnRes = fn(e, resolve, reject, function reTry () {
            i = -1
            this.autoRetryRun(runPromise).then(resolve, reject)
          }.bind(this), options, this.onCatchEmits.length)
        } catch (e) {
          reject(e)
        }
        if (fnRes && fnRes.then) {
          return fnRes.then(resolve, reject)
        }
      }.bind(this)).then(function (res) {
        return this.emitThen(res, runPromise, options)
      }.bind(this), function (e) {
        return this.emitCatch(e, runPromise, options, ++i)
      }.bind(this))
    } else {
      return Promise.reject(e)
    }
  },
  onCatch: function onCatch (fn) {
    if (!Array.isArray(this.onCatchEmits)) {
      this.onCatchEmits = []
    }
    this.onCatchEmits.push(fn)
  },
  onThen: function onThen (fn) {
    if (!Array.isArray(this.onThenEmits)) {
      this.onThenEmits = []
    }
    this.onThenEmits.push(fn)
  },
  onBegin: function onBegin (fn) {
    if (!Array.isArray(this.onBeginEmits)) {
      this.onBeginEmits = []
    }
    this.onBeginEmits.push(fn)
  }
})
