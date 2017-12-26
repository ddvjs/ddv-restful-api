// 导出模块 -- 因为打包工具的特殊性，导出模块必须提前，否则异常
module.exports = nextTickPromise
// 工具
var util = require('../util')
function nextTickPromise () {
  var isNotRun = true
  return new Promise(function (resolve) {
    // 下一进程运行
    util.nextTick(function () {
      if (isNotRun && resolve) {
        resolve()
      }
      resolve = isNotRun = void 0
    })
  })
}
