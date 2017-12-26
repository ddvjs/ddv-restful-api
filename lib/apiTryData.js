var api = require('./api.js')
var util = require('../util')

api.data = function tryGetData (context, promiseFnRun, _dataOld) {
  if (util.isFunction(context) || (context && util.isFunction(context.then))) {
    promiseFnRun = context
    context = void 0
  }
  var promiseFnReload = void 0
  var self = this
  var data = Object && Object.create ? Object.create(null) : {}
  return new Promise(function tryGetDataRun (resolve, reject) {
    var _promise
    if (util.isFunction(promiseFnRun)) {
      _promise = promiseFnRun.call(self, data, function (inputData) {
        if (data && inputData && typeof inputData === 'object') {
          Object.assign(data, inputData)
        }
      }, context)
      promiseFnReload = promiseFnRun
    } else if (promiseFnRun && util.isFunction(promiseFnRun.then)) {
      _promise = promiseFnRun
    }
    self = promiseFnRun = void 0
    // 必须是Promise实例化的对象
    if (_promise && util.isFunction(_promise.then)) {
      _promise.then(function resData (res) {
        // 如果没有return数据就返回一个data
        res = res === void 0 ? data : res
        data = void 0
        return res
      }).catch(function (e) {
        // 如果请求出现了异常
        return api.dataErrorEmit({context: context, error: e}).then(function (res) {
          if (res && res.isReload === true) {
            if (promiseFnReload) {
              // 重新发送整个请求
              return api.data(context, promiseFnReload, _dataOld)
            } else {
              var e = new Error('Please resubmit or try again')
              e.error_id = 'UNKNOW_ERROR'
              throw e
            }
          } else if (res && res.res !== void 0) {
            // 返回指定结果
            return res.res
          }
        })
      }).then(resolve).catch(reject)
    } else {
      var e = new Error('Your argument must be a Promise, or a method, and this method returns Promise after the call')
      e.error_id = 'UNKNOW_ERROR'
      reject(e)
    }
    _promise = void 0
  })
}
api._onDataServerErrorFn = null
api.onDataServerError = function onDataServerError (fn) {
  api._onDataServerErrorFn = fn
}
api._onDataClientErrorFn = null
api.onDataClientError = function onDataClientError (fn) {
  api._onDataClientErrorFn = fn
}
api.dataErrorEmit = function dataErrorEmit (input) {
  var context, error
  context = (input && input.context) || context
  error = (input && input.error) || error
  var _promise = new Promise(function checkOnDataErrorArr (resolve, reject) {
    reject(error)
    resolve = reject = void 0
  })
  if (context && context.isServer) {
  // 有上下文 并且是服务器端
    if (util.isFunction(api._onDataServerErrorFn)) {
      _promise = _promise.catch(function onCatch (e) {
        e = api._onDataServerErrorFn(e, context)
        context = void 0
        return e
      })
    }
  } else {
  // 否则统一客户端方法处理
    if (util.isFunction(api._onDataClientErrorFn)) {
      _promise = _promise.catch(function onCatch (e) {
        e = api._onDataClientErrorFn(e, context)
        context = void 0
        return e
      })
    }
  }
  return _promise
}
