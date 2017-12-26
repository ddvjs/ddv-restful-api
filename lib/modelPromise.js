// 导出模块 -- 因为打包工具的特殊性，导出模块必须提前，否则异常
module.exports = modelPromise
var util = require('../util')
// 下一进程运行 Promise
var nextTickPromise = require('./nextTickPromise.js')
function modelPromise (callfn, modelPrototype) {
  // 创建一个 promise
  var promise = new Promise(function (resolve, reject) {
    // 推迟到下一进程
    nextTickPromise()
      // 如果有方法就执行
      .then(function () {
        if (typeof callfn === 'function') {
          // 运行方法
          return callfn.call(promise)
        }
        // 回收
        callfn = promise = void 0
      })
      // 反馈结果
      .then(resolve, reject)
    // 回收
    resolve = reject = void 0
  })
  var key
  var modelPrototypes = util.argsToArray(arguments).slice(1)
  modelPrototypes.forEach(function (modelPrototype) {
    for (key in modelPrototype) {
      if (!Object.hasOwnProperty.call(modelPrototype, key)) continue
      if (typeof modelPrototype[key] === 'function') {
        promise[key] = modelPrototype[key].bind(promise)
      } else {
        promise[key] = modelPrototype[key]
      }
    }
  })
  key = modelPrototype = void 0
  return promise
}
