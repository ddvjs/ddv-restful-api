/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var api, Api, Apip;
	var api = module.exports = function ddvRestFulApi(path) {
	    var _promise = new api.Api(function(resolve, reject){
	        api.nextTick(function(){
	            var e = null;
	            if(typeof path === 'object'){
	                _promise.path(path.path);
	                _promise.sendData(path.data);
	                _promise.headers(path.headers);
	                _promise.method(path.method);
	            }else if(typeof path === 'string'){
	                _promise.path(path || '/');
	            }else{
	                e = new api.ApiError('method type error');
	                _promise._reject(e);
	            }
	            if(!e){
	                _promise._resolve = resolve ;
	                _promise._reject = reject ;
	            }
	            api.nextTick.call(_promise, function(){
	                var _promise = this ;
	                let ds=3;
	                api.request(_promise, function (e, res) {
	                    if (_promise) {
	                        if (e) {
	                            _promise._reject(e);
	                        }else{
	                            _promise._resolve(res);
	                        }
	                    }
	                    e = res = _promise = void 0;
	                });
	            });
	            e = _promise = resolve = reject = void 0;
	        });
	    });
	    _promise._path = "/";
	    _promise._method = "GET";
	    _promise._headers = Object.create(null);
	    _promise._data = Object.create(null);
	    return _promise;
	};
	//GET请求
	api.get = function ddvRestFulApiGet(path) {
	    return api(path).method('GET');
	};
	//POST请求
	api.post = function ddvRestFulApiPost(path) {
	    return api(path).method('POST');
	};
	//PUT请求
	api.put = function ddvRestFulApiPut(path) {
	    return api(path).method('PUT');
	};
	//DELETE请求
	api.del = api['delete'] = function ddvRestFulApiDelete(path) {
	    return api(path).method('DELETE');
	};
	//实例化构造函数
	api.Api = Api = class DdvRestFulApi extends Promise{
	    //构造函数
	    constructor(fn){
	        //调用父类构造函数
	        super(fn);
	        console.log(23333);
	        fn = void 0 ;
	    }
	    headers(headers){
			this._headers = this._headers || Object.create(null);
	        Object.assign(this._headers, headers||Object.create(null));
			return this;
		}
	    path(path){
	        this._path = (path||'/').toString() ;
	        return this;
	    }
	    method(method){
	        this._method = (method || this._method || 'GET').toString().toUpperCase();
	        return this;
	    }
	    sendData(data){
			this._data = this._data || Object.create(null);
	        Object.assign(this._data, data||Object.create(null));
			return this;
		}
	};
	api.request = __webpack_require__(2);
	//发送别名
	api.Api.prototype.send = api.Api.prototype.sendData;
	//成功别名
	api.Api.prototype.success = api.Api.prototype.then;
	//错误别名
	api.Api.prototype.error = api.Api.prototype.catch;
	//失败别名
	api.Api.prototype.fail = api.Api.prototype.catch;
	//自定义错误类型
	api.ApiError = class ApiError extends Error{
	    //构造函数
	    constructor(message, stack){
	        //调用父类构造函数
	        super(message);
	        message = message || 'Unknow Error';
	        this.name = this.name||'Error';
	        this.type = this.type||'ApiError';
	        this.error_id = this.error_id||'UNKNOW_ERROR';
	        this.stack += stack?('\n'+stack):'';
	        message = stack = void 0 ;
	    }
	};
	//下一进程访问
	api.nextTick = function(fn){
	    var _this = this;
	    api.nextTickSys(function () {
	        if (typeof fn === 'function') {
	            fn.call(_this);
	        }
	        _this = fn = void 0;
	    });
	    setTimeout(function () {
	        if (typeof fn === 'function') {
	            fn.call(_this);
	        }
	        _this = fn = void 0;
	    }, 0);
	};
	api.nextTickQueue = [];
	api.nextTickSys = (function(){
	    var fnc;
	    if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
	        fnc = process.nextTick;
	    }else{
	        'r webkitR mozR msR oR'.split(' ').forEach(function(prefixes) {
	            if (typeof fnc === 'function') {
	                return false;
	            }
	            fnc = window[prefixes + 'equestAnimationFrame'];
	        })
	        fnc = (fnc && fnc.bind && fnc.bind(window)) || window.setImmediate;
	        if (typeof fnc !== 'function') {
	            if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
	                fnc = function(f) {
	                    setTimeout(f,0);
	                };
	            } else {
	                window.addEventListener('message', function() {
	                    var i = 0;
	                    while (i < api.nextTickQueue.length) {
	                        try {
	                            api.nextTickQueue[i++]();
	                        } catch (e) {
	                            api.nextTickQueue = api.nextTickQueue.slice(i);
	                            window.postMessage('nextTick!', '*');
	                            throw e;
	                        }
	                    }
	                    api.nextTickQueue.length = 0;
	                }, true);
	                fnc = function(fn) {
	                    if (!api.nextTickQueue.length) {
	                        window.postMessage('nextTick!', '*');
	                    }
	                    api.nextTickQueue.push(fn);
	                };
	            }
	        }
	    }
	    return fnc;
	}());
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function request(o, callback) {
	console.log(o, callback)
	};


/***/ }
/******/ ]);
//# sourceMappingURL=api.js.map