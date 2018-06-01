var ddvRestFulApi = require('./api.js')
var onAccessKey = require('./onAccessKey.js')
var request = require('./request.js')
var parseDataByBody = require('./parseDataByBody.js')
var apiTryData = require('./apiTryData.js')
module.exports = ddvRestFulApi.getApi(function (api) {
  api.setHeadersPrefix('x-ddv-')
  api.onAccessKey = onAccessKey
  api.request = request
  apiTryData(api)
  // eslint-disable-next-line no-undef
  if (typeof define !== 'undefined' && typeof requirejs !== 'undefined') {
    // eslint-disable-next-line no-undef
    define(ddvRestFulApi)
  }
  if (typeof window !== 'undefined' && window.window === window) {
    window.ddvRestFulApi = ddvRestFulApi
  }
})

