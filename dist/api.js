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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var api, Api, Apip;
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
	    _promise._baseUrl = api.baseUrl;
	    _promise._path = "/";
	    _promise._method = "GET";
	    _promise._headers = Object.create(null);
	    _promise._data = Object.create(null);
	    _promise._query = Object.create(null);
	    return _promise;
	};
	api.Promise = Promise ;
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
	    query(data){
			this._query = this._query || Object.create(null);
	        Object.assign(this._query, data||Object.create(null));
			return this;
		}
	};
	const url = api.url = __webpack_require__(3);
	const request = api.request = __webpack_require__(4);
	const sign = api.sign = __webpack_require__(5);
	//设置baseUrl
	api.setBaseUrl = function(url){
	    request.baseUrl = api.baseUrl = url ;
	};
	//设置headersPrefix
	api.setHeadersPrefix = function(prefix){
	    sign.headersPrefix = request.headersPrefix = api.headersPrefix = prefix ;
	};
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	module.exports = (function() {
		function _t() {
			return new RegExp(/(.*?)\.?([^\.]*?)\.?(com|net|org|biz|ws|in|me|co\.uk|co|org\.uk|ltd\.uk|plc\.uk|me\.uk|edu|mil|br\.com|cn\.com|eu\.com|hu\.com|no\.com|qc\.com|sa\.com|se\.com|se\.net|us\.com|uy\.com|ac|co\.ac|gv\.ac|or\.ac|ac\.ac|af|am|as|at|ac\.at|co\.at|gv\.at|or\.at|asn\.au|com\.au|edu\.au|org\.au|net\.au|id\.au|be|ac\.be|adm\.br|adv\.br|am\.br|arq\.br|art\.br|bio\.br|cng\.br|cnt\.br|com\.br|ecn\.br|eng\.br|esp\.br|etc\.br|eti\.br|fm\.br|fot\.br|fst\.br|g12\.br|gov\.br|ind\.br|inf\.br|jor\.br|lel\.br|med\.br|mil\.br|net\.br|nom\.br|ntr\.br|odo\.br|org\.br|ppg\.br|pro\.br|psc\.br|psi\.br|rec\.br|slg\.br|tmp\.br|tur\.br|tv\.br|vet\.br|zlg\.br|br|ab\.ca|bc\.ca|mb\.ca|nb\.ca|nf\.ca|ns\.ca|nt\.ca|on\.ca|pe\.ca|qc\.ca|sk\.ca|yk\.ca|ca|cc|ac\.cn|com\.cn|edu\.cn|gov\.cn|org\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|cn|cx|cz|de|dk|fo|com\.ec|tm\.fr|com\.fr|asso\.fr|presse\.fr|fr|gf|gs|co\.il|net\.il|ac\.il|k12\.il|gov\.il|muni\.il|ac\.in|co\.in|org\.in|ernet\.in|gov\.in|net\.in|res\.in|is|it|ac\.jp|co\.jp|go\.jp|or\.jp|ne\.jp|ac\.kr|co\.kr|go\.kr|ne\.kr|nm\.kr|or\.kr|li|lt|lu|asso\.mc|tm\.mc|com\.mm|org\.mm|net\.mm|edu\.mm|gov\.mm|ms|nl|no|nu|pl|ro|org\.ro|store\.ro|tm\.ro|firm\.ro|www\.ro|arts\.ro|rec\.ro|info\.ro|nom\.ro|nt\.ro|se|si|com\.sg|org\.sg|net\.sg|gov\.sg|sk|st|tf|ac\.th|co\.th|go\.th|mi\.th|net\.th|or\.th|tm|to|com\.tr|edu\.tr|gov\.tr|k12\.tr|net\.tr|org\.tr|com\.tw|org\.tw|net\.tw|ac\.uk|uk\.com|uk\.net|gb\.com|gb\.net|vg|sh|kz|ch|info|ua|gov|name|pro|ie|hk|com\.hk|org\.hk|net\.hk|edu\.hk|us|tk|cd|by|ad|lv|eu\.lv|bz|es|jp|cl|ag|mobi|eu|co\.nz|org\.nz|net\.nz|maori\.nz|iwi\.nz|io|la|md|sc|sg|vc|tw|travel|my|se|tv|pt|com\.pt|edu\.pt|asia|fi|com\.ve|net\.ve|fi|org\.ve|web\.ve|info\.ve|co\.ve|tel|im|gr|ru|net\.ru|org\.ru|hr|com\.hr|ly|xyz|so)$/);
		}
	
		function _d(s) {
			return decodeURIComponent(s.replace(/\+/g, ' '));
		}
	
		function _i(arg, str) {
			var sptr = arg.charAt(0),
				split = str.split(sptr);
	
			if (sptr === arg) { return split; }
	
			arg = parseInt(arg.substring(1), 10);
	
			return split[arg < 0 ? split.length + arg : arg - 1];
		}
	
		function _f(arg, str) {
			var sptr = arg.charAt(0),
				split = str.split('&'),
				field = [],
				params = {},
				tmp = [],
				arg2 = arg.substring(1);
	
			for (var i = 0, ii = split.length; i < ii; i++) {
				field = split[i].match(/(.*?)=(.*)/);
	
				// TODO: regex should be able to handle this.
				if ( ! field) {
					field = [split[i], split[i], ''];
				}
	
				if (field[1].replace(/\s/g, '') !== '') {
					field[2] = _d(field[2] || '');
	
					// If we have a match just return it right away.
					if (arg2 === field[1]) { return field[2]; }
	
					// Check for array pattern.
					tmp = field[1].match(/(.*)\[([0-9]+)\]/);
	
					if (tmp) {
						params[tmp[1]] = params[tmp[1]] || [];
	
						params[tmp[1]][tmp[2]] = field[2];
					}
					else {
						params[field[1]] = field[2];
					}
				}
			}
	
			if (sptr === arg) { return params; }
	
			return params[arg2];
		}
	
		return function(arg, url) {
			var _l = {}, tmp, tmp2;
	
			if (arg === 'tld?') { return _t(); }
	
			url = url || ((typeof window !== 'undefined'&&window.location)||'').toString();
	
			if ( ! arg) { return url; }
	
			arg = arg.toString();
	
			if ((tmp = url.match(/^mailto:([^\/].+)/))) {
				_l.protocol = 'mailto';
				_l.email = tmp[1];
			}
			else {
	
				// Ignore Hashbangs.
				if ((tmp = url.match(/(.*?)\/#\!(.*)/))) {
					url = tmp[1] + tmp[2];
				}
	
				// Hash.
				if ((tmp = url.match(/(.*?)#(.*)/))) {
					_l.hash = tmp[2];
					url = tmp[1];
				}
	
				// Return hash parts.
				if (_l.hash && arg.match(/^#/)) { return _f(arg, _l.hash); }
	
				// Query
				if ((tmp = url.match(/(.*?)\?(.*)/))) {
					_l.query = tmp[2];
					url = tmp[1];
				}
	
				// Return query parts.
				if (_l.query && arg.match(/^\?/)) { return _f(arg, _l.query); }
	
				// Protocol.
				if ((tmp = url.match(/(.*?)\:?\/\/(.*)/))) {
					_l.protocol = tmp[1].toLowerCase();
					url = tmp[2];
				}
	
				// Path.
				if ((tmp = url.match(/(.*?)(\/.*)/))) {
					_l.path = tmp[2];
					url = tmp[1];
				}
	
				// Clean up path.
				_l.path = (_l.path || '').replace(/^([^\/])/, '/$1').replace(/\/$/, '');
	
				// Return path parts.
				if (arg.match(/^[\-0-9]+$/)) { arg = arg.replace(/^([^\/])/, '/$1'); }
				if (arg.match(/^\//)) { return _i(arg, _l.path.substring(1)); }
	
				// File.
				tmp = _i('/-1', _l.path.substring(1));
	
				if (tmp && (tmp = tmp.match(/(.*?)\.(.*)/))) {
					_l.file = tmp[0];
					_l.filename = tmp[1];
					_l.fileext = tmp[2];
				}
	
				// Port.
				if ((tmp = url.match(/(.*)\:([0-9]+)$/))) {
					_l.port = tmp[2];
					url = tmp[1];
				}
	
				// Auth.
				if ((tmp = url.match(/(.*?)@(.*)/))) {
					_l.auth = tmp[1];
					url = tmp[2];
				}
	
				// User and pass.
				if (_l.auth) {
					tmp = _l.auth.match(/(.*)\:(.*)/);
	
					_l.user = tmp ? tmp[1] : _l.auth;
					_l.pass = tmp ? tmp[2] : undefined;
				}
	
				// Hostname.
				_l.hostname = url.toLowerCase();
	
				// Return hostname parts.
				if (arg.charAt(0) === '.') { return _i(arg, _l.hostname); }
	
				// Domain, tld and sub domain.
				if (_t()) {
					tmp = _l.hostname.match(_t());
	
					if (tmp) {
						_l.tld = tmp[3];
						_l.domain = tmp[2] ? tmp[2] + '.' + tmp[3] : undefined;
						_l.sub = tmp[1] || undefined;
					}
				}
	
				// Set port and protocol defaults if not set.
				_l.port = _l.port || (_l.protocol === 'https' ? '443' : '80');
				_l.protocol = _l.protocol || (_l.port === '443' ? 'https' : 'http');
				_l.protocol = _l.protocol+':';
			}
	
			// Return arg.
			if (arg in _l) { return _l[arg]; }
	
			// Return everything.
			if (arg === '{}') { return _l; }
	
			// Default to undefined for no match.
			return undefined;
		};
	})();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	const request = module.exports = function request(o, callback) {
	    return new request.Request(o, callback);
	};
	const url = __webpack_require__(3);
	const sign = __webpack_require__(5);
	const api = __webpack_require__(1);
	const Promise = api.Promise ;
	const Request = request.Request = class ddvRequest {
	    constructor(o, callback) {
	        //回调
	        this.callback = callback ;
	        //基本参数初始化
	        this._baseInit(o);
	        //请求参数编码
	        this._buildParams();
	        //开始运行
	        this._run();
	    }
	    _baseInit(o){
	        this.input_o = o ;
	        this.method = o._method ||'GET' ;
	        this.headers = o._headers || Object.create(null);
	        this.data = o._data || Object.create(null);
	        this.queryObject = o._query || Object.create(null);
	        this.path = o._path || '/' ;
	        this.path = (this.path.charAt(0)=='/'?'':'/') + this.path;
	        this.query = (url('query',this.path)||'').toString();
	        this.path = url('path',this.path)||'/';
	        this.baseUrl = o._baseUrl || this.baseUrl || request.baseUrl || api.baseUrl || '';
	
	        this.host = url('hostname',this.baseUrl);
	        this.port = url('port',this.baseUrl);
	        this.protocol = url('protocol',this.baseUrl);
	        this.request_id = this.request_id || request.createRequestId();
	    }
	    _buildParams(){
	        var str;
	        if (this.queryObject) {
	            str = request.buildParams(this.queryObject, true);
	            if (str) {
	                this.query += (this.query.length>0?'&':'') + str;
	            }
	        }
	        if (this.method === 'GET') {
	            str = request.buildParams(this.data, true);
	            if (str) {
	                this.query += (this.query.length>0?'&':'') + str;
	            }
	        }else{
	            this.body = request.buildParams(this.data);
	        }
	    }
	    _run(){
	        new Promise((resolve, reject)=>{
	            sign(this);
	        });
	        console.log(8555,this);
	    }
	}
	
	
	request.kEscapedMap = {
	    '!' : '%21',
	    '\'': '%27',
	    '(' : '%28',
	    ')' : '%29',
	    '*' : '%2A'
	};
	//path编码
	request.urlEncodeExceptSlash=function(value){
	    return request.urlEncode(value,false);
	};
	//编码
	request.urlEncode = function (string, encodingSlash) {
	    var result = encodeURIComponent(string);
	    result = result.replace(/[!'\(\)\*]/g, function ($1) {
	        return request.kEscapedMap[$1];
	    });
	    if (encodingSlash === false) {
	        result = result.replace(/%2F/gi, '/');
	    }
	    return result;
	};
	//编码
	request.buildParams = function (data, isQuery) {
	    var r = request._buildParams(data, '').join('&');
	    if (isQuery) {
	        r = r.replace( /%20/gi, '+' );
	    }
	    return r;
	};
	request._buildParams = function (data, prefix) {
	    var r = [], i, key, keyt, value;
	    if (typeof data==='object') {
	        //数组
	        if (Array.isArray(data)) {
	            for (i = 0; i < data.length; i++) {
	                //值
	                value = data[i];
	                //键
	                keyt =  request._buildParamsAddPrefix(i, prefix, (typeof value==='object'));
	                //递归处理对象和数组
	                if (typeof value==='object') {
	                    //插入数组
	                    r.push.apply(r, request._buildParams(value, keyt));
	                } else {
	                    //插入数组
	                    r.push(request.urlEncode(keyt) + '=' + request.urlEncode(value));
	                }
	            }
	        } else {
	            for (key in data) {
	                if (!Object.hasOwnProperty.call(data, key)) {
	                    continue;
	                }
	                //值
	                value = data[key];
	                //键
	                keyt =  request._buildParamsAddPrefix(key, prefix);
	                if (typeof value==='object') {
	                    //插入数组
	                    r.push.apply(r, request._buildParams(value, keyt));
	                } else {
	                    //插入数组
	                    r.push(request.urlEncode(keyt) + '=' + request.urlEncode(value));
	                }
	            }
	        }
	    }
	    return r;
	};
	request._buildParamsAddPrefix = function (key, prefix, isNotArray) {
	    if (prefix) {
	        return prefix + '[' + (isNotArray!==false?key:'') + ']' ;
	    }else{
	        return key;
	    }
	};
	//生成请求id
	const createRequestId = request.createRequestId = function createRequestId(){
		var pid, t, rid, rid_len, rid_t, rid_new, i ;
			//获取16进制的 pid
			pid = Number(request.createNewPid(true)).toString(16);
			//种子
			rid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
			rid_new = '';
			for (i = rid.length - 1; i >= 0; i--) {
				rid_t = rid[i] ;
				if (rid_t == 'x') {
					rid_len = pid.length ;
					rid_t = pid ? pid.charAt(rid_len-1):'x';
					pid = pid.substr(0, rid_len-1);
				}
				rid_new = rid_t + rid_new;
			}
			rid = request.createGuid(rid_new);
			i = rid_new = rid_t = rid_len = t = pid = undefined ;
		return rid ;
	};
	var createNewidSumLast, createNewidTimeLast ;
	createNewidSumLast = 0 ;
	createNewidTimeLast = 0 ;
	const createNewPid = request.createNewPid = function createNewid(is_10) {
	    var r ;
	        if (createNewidTimeLast!==request.time()) {
	            createNewidTimeLast = request.time() ;
	            createNewidSumLast = 0 ;
	        }
	        r = createNewidTimeLast.toString() + (++createNewidSumLast).toString();
	        //使用36进制
	        if (!is_10) {
	            r = parseInt(r,10).toString(36);
	        }
	        return r ;
	};
	//生成guid
	const createGuid = request.createGuid = function createGuid(s) {
	    return (s||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	};
	//获取当前时间开始
	const now = request.now = function now() {
	    return (new Date()).getTime();
	};
	//获取php的时间戳
	const time = request.time = function time() {
	    return parseInt(request.now()/1000);
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	//导出签名模块
	const sign = module.exports = function sign(o){
	    sign._signRun(o);
	};
	//引入请求模块
	const request = __webpack_require__(4);
	//引入签名模块
	Object.assign(sign, __webpack_require__(6));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    headersPrefix: 'x-ddv-',
	    excludeHeaderKeys: ['host','content-length','content-type','content-md5'],
	    //签名头
	    _signRun(o){
	        sign._signRunBaseInit(o);
	        sign._signRunQueryInit(o);
	        sign._signRunHeadersFormat(o);
	        sign._signRunHeadersInit(o);
	    },
	    _signRunHeadersInit(o){
			//要签名的头的key的一个数组
			o.authHeadersStr = [];
			//签名的头
			o.authCanonicalHeadersStr = [];
	
			o.headersPrefix = o.headersPrefix || sign.headersPrefix || request.headersPrefix ;
			o.headersPrefixLen = o.headersPrefix.length ;
	        var keyLower, key, value, headersOld = o.headers ;
	        for (key in headersOld) {
	            if (!Object.hasOwnProperty.call(headersOld, key)) {
	                continue;
	            }
	            //取得key对应的value
	            value = headersOld[key];
	            //小写的key
	            keyLower = key.toLowerCase();
	            //判断一下
	            if (sign.excludeHeaderKeys.indexOf(keyLower)>-1||keyLower.substr(0,o.headersPrefixLen)==o.headersPrefix){
	                o.authCanonicalHeadersStr.push( request.urlEncode(keyLower) +':'+ request.urlEncode(value));
	                o.authHeadersStr.push( keyLower);
	            }
	
	        }
	
			o.authCanonicalHeadersStr.sort();
			//用\n拼接
			o.authCanonicalHeadersStr = o.authCanonicalHeadersStr.join(o.n);
			//用;拼接
			o.authHeadersStr = o.authHeadersStr.join(';');
	    },
	    //格式化头
	    _signRunHeadersFormat(o){
			//克隆
			var headersTemp = Object.create(null) ;
	        var headersOld = o.headers;
	        var value = '';
	        var key = '';
			//遍历头
			for (key in headersOld) {
				//去左右空格
				key = sign._trim(key);
	            value = sign._trim(headersOld[key]);
				switch(key.toLowerCase()){
					case 'authorization':
						continue;
					case 'host':
						key='Host';
						break ;
					case 'content-length':
						key='Content-Length';
						break ;
					case 'content-type':
						key='Content-Type';
						break ;
					case 'content-md5':
						key='Content-Md5';
						break ;
				}
				if (value) {
					headersTemp[key] = value;
				}
			}
			//把处理后的赋值回给
			o.headers = headersTemp ;
			//释放内存
			headersTemp = headersOld = key = value = void 0 ;
			//强制有host头
			o.headers.Host = o.headers.Host?o.headers.Host:o.host;
	
	
			if (o.body&&o.body.length>0) {
				o.headers['Content-Length'] = o.headers['Content-Length']?o.headers['Content-Length']:o.body.length;
				o.headers['Content-Type'] = o.headers['Content-Type']?o.headers['Content-Type']:'application/x-www-form-urlencoded; charset=UTF-8';
				o.headers['Content-Md5'] = sign.md5Base64(o.body);
			}
	    },
	    //初始化GET参数
	    _signRunQueryInit(o){
			//签名数组
			let queryArray = [];
			if (o.query&&o.query.length>0) {
	            o.query.split('&').forEach(function(t) {
					if (!t) {
						return ;
					}
					var key , value, i;
						//找到第一个等号的首次出现位置
						i = t.indexOf('=');
						//取得key
						key = t.substr(0,i);
						//取得value
						value = t.substr(i+1);
						//先去左右空格再编码
						key = request.urlEncode(sign._trim(key));
						value = request.urlEncode(sign._trim(value));
						//插入新数组
						queryArray.push(key+'='+value);
				})
			}
			//排序
			queryArray.sort();
			//用&拼接
			o.query = queryArray.join('&');
			//回收内存
			queryArray = void 0 ;
	    },
	    //base初始化
	    _signRunBaseInit(o){
	        //默认换行
			o.n = o.n || '\n';
			//请求id
			o.request_id = o.request_id || request.createRequestId();
	        //请求方式
	        o.method = (o.method || 'GET').toString().toUpperCase();
	        //强制是字符串
	        o.query = o.query || '';
	        //get请求
			if (o.method.toLowerCase()=='GET') {
	            //如果有请求体
	            if (o.body) {
	                //拼接到query中
	                o.query += o.query ? '&' :'';
	                //清空请求体
	                o.body = '';
	            }
			}else{
				o.body = o.body||'';
			}
	    },
	    _trim(str){
	        return str.toString().trim();
	    },
	    md5Base64(str){
	        return 's';
	    }
	};
	const sign = __webpack_require__(5);
	const request = __webpack_require__(4);


/***/ }
/******/ ]);
//# sourceMappingURL=api.js.map