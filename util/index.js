// 导出模块
var util = require('ddv-auth/util')
module.exports = util
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
