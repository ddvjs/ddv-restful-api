'use strict'
var nextTickQueue = []

var nextTickSys = (function () {
  var fnc
  if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
    fnc = process.nextTick
  } else {
    'r webkitR mozR msR oR'.split(' ').forEach(function (prefixes) {
      if (typeof fnc === 'function') {
        return false
      }
      fnc = window[prefixes + 'equestAnimationFrame']
    })
    fnc = (fnc && fnc.bind && fnc.bind(window)) || window.setImmediate
    if (typeof fnc !== 'function') {
      if (typeof window === 'undefined' || window.ActiveXObject || !window.postMessage) {
        fnc = function (f) {
          setTimeout(f, 0)
        }
      } else {
        window.addEventListener('message', function () {
          var i = 0
          while (i < nextTickQueue.length) {
            try {
              nextTickQueue[i++]()
            } catch (e) {
              nextTickQueue.splice(0, i)
              window.postMessage('nextTick!', '*')
              throw e
            }
          }
          nextTickQueue.length = 0
        }, true)
        fnc = function (fn) {
          if (!nextTickQueue.length) {
            window.postMessage('nextTick!', '*')
          }
          nextTickQueue.push(fn)
        }
      }
    }
  }
  return fnc
}())

// 下一进程访问
module.exports = function (fn) {
  var _this = this
  nextTickSys(function () {
    if (typeof fn === 'function') {
      fn.call(_this)
    }
    _this = fn = void 0
  })
  setTimeout(function () {
    if (typeof fn === 'function') {
      fn.call(_this)
    }
    _this = fn = void 0
  }, 0)
}
