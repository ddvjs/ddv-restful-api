'use strict'
module.exports = function runRequest (o) {
  return ajax(o).then(function (serverRes) {
    Object.assign(o.serverRes, serverRes)
    var e
    if (o.serverRes.statusCode >= '200' && o.serverRes.statusCode < '300') {
      return o
    } else {
      o.serverRes.message = o.serverRes.message || o.serverRes.msg || o.serverRes.status || 'Unknow Error'
      e = new Error(o.serverRes.message)
      e.statusCode = o.serverRes.statusCode
      e.error_id = e.error_id || o.serverRes.error_id || o.serverRes.status
      e.message = o.serverRes.message || o.serverRes.status || 'Unknow Error'
      e.body = o.serverRes.body
      throw e
    }
  }).catch(function (e) {
    Object.assign(o.serverRes, e)
    return Promise.reject(e)
  })
}
var ajax = require('./ajax.js')
