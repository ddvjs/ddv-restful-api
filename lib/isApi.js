module.exports = isApi
var util = require('ddv-auth/util')
function isApi (api) {
  return typeof api === 'function' && typeof api.setBaseUrl === 'function' && api[isApi.checkName] === isApi.checkValue
}
isApi.checkName = 'ddvApiCheck_' + util.time()
isApi.checkValue = util.time() + '' + parseInt(Math.random() * 9999999)
