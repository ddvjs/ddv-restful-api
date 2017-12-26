// 导出模块

module.exports = parseDataByBody

function parseDataByBody (res, isError) {
  var r = null
  var e = null
  try {
    r = JSON.parse(res.body)
  } catch (e1) {
    e = e1
    e.body = res.body
  }
  if (e) {
    e.statusCode = res.statusCode
    e.errorId = res.status
    e.message = res.message || res.msg || res.status || 'Unknow Error'
    e.body = res.body
    return Promise.reject(e)
  } else if (r) {
    r.statusCode = r.statusCode || r.code || res.statusCode
    r.errorId = r.errorId || res.status
    r.message = r.message || r.msg || res.status || 'Unknow Error'
    r.body = res.body
    if (r.statusCode >= 200 && r.statusCode < 300) {
      return isError !== true ? Promise.resolve(r) : Promise.reject(r)
    } else {
      e = new Error(r.message)
      e.statusCode = r.statusCode
      e.errorId = r.errorId
      e.message = r.message
      e.body = res.body
      return Promise.reject(e)
    }
  }
}
