module.exports = onAccessKey
// 工具
var util = require('../util')
var url = require('ddv-auth/util/url')
var session = require('./session.js')
function onAccessKey (auth, requests, response, tryNum) {
  return session.getTrueData(url.build({
    scheme: auth.scheme,
    host: auth.host,
    port: auth.port,
    user: auth.user,
    pass: auth.pass,
    path: session.sessionInitPath
  }), requests, response, tryNum)
    .then(function (data) {
      var d = new Date()
      auth.setSignTimeString(new Date(parseInt(d.getTime() + ((parseInt(data.differenceTime) || 0) * 1000)) + (60 * d.getTimezoneOffset())))
      d = void 0
      auth.setRequestId(util.createRequestId()).setAuthVersion('app-auth-v2')
      auth.setAccessKeyId(data.sessionId).setAccessKey(data.sessionKey).setDeviceCard(data.sessionCard)

      return auth
    })
}
