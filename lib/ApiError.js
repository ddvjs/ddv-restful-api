'use strict'
// 自定义错误类型
class ApiError extends Error {
  // 构造函数
  constructor (message, stack) {
    // 调用父类构造函数
    super(message)
    message = message || 'Unknow Error'
    this.name = this.name || 'Error'
    this.type = this.type || 'ApiError'
    this.error_id = this.error_id || 'UNKNOW_ERROR'
    this.stack += stack ? ('\n' + stack) : ''
    message = stack = void 0
  }
}
module.exports = ApiError
