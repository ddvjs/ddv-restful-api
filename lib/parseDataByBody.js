// 导出模块

module.exports = parseDataByBody

function parseDataByBody (res, isError) {
  var r = null
  var e = null
  try {
    r = typeof res.body === 'object' ? res.body : JSON.parse(res.body)
  } catch (e1) {
    e = e1
    e.body = res.body
  }
  if (e) {
    e.statusCode = res.statusCode
    e.errorId = res.status
    e.exceptionId = res.status
    e.message = res.message || res.msg || res.status || 'Unknow Error'
    e.body = res.body
    return Promise.reject(e)
  } else if (r) {
    r.statusCode = r.statusCode || r.code || res.statusCode
    r.errorId = r.errorId || res.status
    r.exceptionId = r.exceptionId || res.status
    r.message = r.message || r.msg || res.status || 'Unknow Error'
    // 这里深拷贝一下res.body，不然会循环引用
    r.body = typeof res.body === 'object' ? JSON.parse(JSON.stringify(res.body)) : JSON.parse(res.body)
    if (r.statusCode >= 200 && r.statusCode < 300) {
      return isError !== true ? Promise.resolve(r) : Promise.reject(r)
    } else {
      e = new Error(r.message)
      e.statusCode = r.statusCode
      e.errorId = r.errorId
      e.exceptionId = r.exceptionId
      e.message = r.message
      e.body = res.body
      return Promise.reject(e)
    }
  }
}
