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
	var api = module.exports = function ddvRestFulApi(path, req, res) {
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
	                console.log('path',path)
	                reject(e);
	            }
	            //如果没有错误
	            if(!e){
	                _promise._resolve = resolve ;
	                _promise._reject = reject ;
	                //设定请求对象
	                if (req&&req.req&&req.res) {
	                    _promise.context(req);
	                }else{
	                    _promise.req(req);
	                    _promise.res(res);
	                }
	            }
	            //回收变量
	            e = path = req = res = resolve = reject = void 0;
	            api.nextTick.call(_promise, function(){
	                var _promise = this ;
	                api.request(_promise, function (e, res) {
	                    if (_promise) {
	                        console.log(444444);
	                        console.log(_promise);
	                        if (e) {
	                            if (typeof _promise._reject==='function') {
	                                _promise._reject(e);
	                            }else{
	                                console.error('_promise._reject error',e);
	                            }
	                        }else{
	                            if (typeof _promise._resolve==='function') {
	                                _promise._resolve(res);
	                            }else{
	                                console.error('_promise._resolve error',res);
	                            }
	                        }
	                    }
	                    e = res = _promise = void 0;
	                });
	            });
	            _promise = void 0;
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
	const url = api.url = __webpack_require__(3);
	const request = api.request = __webpack_require__(4);
	const sign = api.sign = __webpack_require__(5);
	const session = api.session = __webpack_require__(6);
	//设置baseUrl
	api.setBaseUrl = function(url){
	    request.baseUrl = api.baseUrl = url ;
	};
	//设置headersPrefix
	api.setHeadersPrefix = function(prefix){
	    sign.headersPrefix = request.headersPrefix = api.headersPrefix = prefix ;
	};
	//设置是否使用长存储
	api.setLongStorage = function(isUseLong){
	    session.isLongStorage = Boolean(isUseLong) ;
	};
	//GET请求
	api.get = function ddvRestFulApiGet(path, req, res) {
	    return api(path, req, res).method('GET');
	};
	//POST请求
	api.post = function ddvRestFulApiPost(path, req, res) {
	    return api(path, req, res).method('POST');
	};
	//PUT请求
	api.put = function ddvRestFulApiPut(path, req, res) {
	    return api(path, req, res).method('PUT');
	};
	//DELETE请求
	api.del = api['delete'] = function ddvRestFulApiDelete(path, req, res) {
	    return api(path, req, res).method('DELETE');
	};
	//实例化构造函数
	api.Api = Api = class DdvRestFulApi extends api.Promise{
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
	    req(req){
	        this._req = req || this._req || null;
	    }
	    res(res){
	        this._res = res || this._res || null;
	    }
	    context(context){
	        if(context.req&&context.res){
	            this.req(context.req);
	            this.res(context.res);
	        }else if(context.requests&&context.response){
	            this.req(context.requests);
	            this.res(context.response);
	        }
		}
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
	
	        this.req = o._req || null;
	        this.res = o._res || null;
	
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
	        //签名
	        sign(this).then(function(res){
	            console.log('回调成功',res);
	        }).catch(function(e){
	            console.log('回调失败',e);
	
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
	    return sign._signRun(o);
	};
	//引入请求模块
	const request = __webpack_require__(4);
	const session = __webpack_require__(6);
	//引入签名运行模块
	Object.assign(sign, __webpack_require__(10));
	//引入签名会话模块


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const cbs = [];
	let _getSessionTrueDataCbsIng = false;
	const session = module.exports = {
	    getTrueData(o){
	        return new api.Promise(function(resolve, reject) {
	            var isRun = false ;
	            //处理回调
	            if (o.req) {
	                o.req._getSessionTrueDataCbs = o.req._getSessionTrueDataCbs || [];
	                //服务端-处理同一请求多次初始化会话的问题，同一回调
	                o.req._getSessionTrueDataCbs.push([resolve, reject]);
	                o.req._getSessionTrueDataCbs.push([function(){
	                    if(this&&this.req){
	                        this.req._getSessionTrueDataCbsIng = false;
	                    }
	                }.bind(o), function(){
	                    if(this&&this.req){
	                        this.req._getSessionTrueDataCbsIng = false;
	                    }
	                }.bind(o)]);
	                if (o.req._getSessionTrueDataCbsIng!==true) {
	                    isRun = true ;
	                    o.req._getSessionTrueDataCbsIng=true;
	                }
	            }else if(session.isClientWindow){
	                //浏览器-处理同一请求多次初始化会话的问题，同一回调
	                cbs.push([resolve, reject]);
	                cbs.push([function(){
	                    _getSessionTrueDataCbsIng = false;
	                }, function(){
	                    _getSessionTrueDataCbsIng = false;
	                }]);
	                if (_getSessionTrueDataCbsIng!==true) {
	                    isRun = true ;
	                    _getSessionTrueDataCbsIng=true;
	                }
	            }else{
	                reject(new Error('Neither a browser nor req and res'));
	            }
	            if (isRun) {
	                session._getTrueDataRun(o);
	            }
	            resolve = reject = o = isRun = void 0;
	        });
	    },
	    //开始运行
	    _getTrueDataRun(o){
	        session.getData(o).then(function(o){
	            console.log('继续',o);
	        });
	    },
	    getData(o){
	        return new api.Promise(function(resolve, reject) {
	            if(!o.cookieName){
	                //根据host和port生成cookieName
	                o.cookieName = o.host + (o.port?(':'+o.port):'');
	            }
	            //编码cookieName
	            o.cookieNameEnCode = session._cookieNameEnCode(o.cookieName);
	            if (o.req&&o.res) {
	                //服务器模式
	                session._getDataNode(o, resolve, reject);
	            }else if(isClientWindow){
	                //客户端
	                session._getDataClient(o, resolve, reject);
	            }else{
	                //不确定是什么浏览器
	                reject(new Error('Neither a browser nor req and res'));
	            }
	            resolve = reject = o = void 0;
	        }).then(function(o){
	            //反序列化会话数据
	            return new api.Promise(function(resolve, reject) {
	                if (o.sessionDataStr&&typeof o.sessionDataStr ==='string'){
	                    try {
	                        o.sessionData = JSON.parse(o.sessionDataStr);
	                    } catch (e) {
	                        o.sessionData = o.sessionData || Object.create(null)
	                    }
	                }else{
	                    o.sessionData = o.sessionData || Object.create(null)
	                }
	                //清理
	                delete o.sessionDataStr ;
	                //序列化用于后期比对
	                o.sessionDataOldStr = session.arrayToStr(o.sessionData);
	                //回调下一步
	                resolve(o);
	            });
	        });
	    },
	    //node服务端获取
	    _getDataNode(o, resolve, reject){
	        var cookiename, data;
	        try{
	    		cookiename = o.cookieNameEnCode ;
	    		o.sessionDataStr = session._getCookiesByStr(cookiename,  (o.req&&o.req.headers&&o.req.headers.cookie||'')) || o.sessionDataStr ;
	    		//本地存储模块
	            if (typeof resolve ==='function') {
	                resolve(o);
	            }
	        }catch(e){
	            if (typeof reject ==='function') {
	                reject(e);
	            }
	        }
	        resolve = reject = data = o = void 0;
	    },
	    //客户端获取
	    _getDataClient(o, resolve, reject){
	        var cookiename, data;
	        if (!(session.isLocalCookie||session.isLocalStorage||session.isSessionStorage)) {
	            reject(new Error('Your browser does not support cookies and localStorage'));
	            return ;
	        }
	        try{
	    		cookiename = o.cookieNameEnCode ;
	    		data = session._getCookiesClient(cookiename) || null ;
	    		//本地存储模块
	    		if(!data){
	    			try{
	    				if (session.isLongStorage) {
	    					//长期存储模式
	    					data = localStorage.getItem(cookiename) || null ;
	    					session._setCookiesClient(cookiename, data);
	    				}else{
	    					//会话形式
	    					data = sessionStorage.getItem(cookiename) || null ;
	    					session._setCookiesClient(cookiename, data, session.getExpiresDate('365', '12', '60'));
	    				}
	    			}catch(e){
	    				data = null ;
	    			}
	    		}
	            o.sessionDataStr = data || o.sessionDataStr ;
	            if (typeof resolve ==='function') {
	                resolve(o);
	            }
	        }catch(e){
	            if (typeof reject ==='function') {
	                reject(e);
	            }
	        }
	        resolve = reject = data = o = void 0;
	    },
	    //客户端读取
	    _getCookiesClient(key){
	        if (session.isLocalCookie) {
	            return session._getCookiesByStr(key, document.cookie);
	        }else{
	            return '';
	        }
	    },
	    //客户端存储
	    _setCookiesClient(key){
	    },
	    _cookieNameEnCode(name){
			name =  cryptoJsCore.enc.Utf8.parse((name||'sid').toString()||'').toString(cryptoJsBase64);
			name = name.replace(/_/g,'____').replace(/\+/g,'___').replace(/\//g,'__').replace(/=/g,'_');
			return name;
		},
	    //数组序列化
	    _getCookiesByStr(key, str){
	        var value = '';
	        ((str || '').split(';')||[]).forEach(function(t,i){
	            var a = (t||'').split('=')||[];
	            if ((a[0]||'').toString().trim()===key) {
	                value = session.unescape((a[1]||'').toString().trim());
	            }
	            a = t = i = void 0 ;
	        });
	        return value;
	    },
	    //数组序列化
	    arrayToStr(obj){
	    	var a = [], name;
	            for (name in obj) {
	                if (!Object.hasOwnProperty.call(obj, name)) {
	                    continue;
	                }
	    			a.push(name+'='+obj[name]);
	            }
	            name = void 0;
	    		a.sort();
	    		obj = void 0;
	    		a = a.join(';');
	    		return a;
	    },
	    isNumber(obj){
			return (typeof obj==='string'||typeof obj==='number')&&(!Array.isArray( obj ) && (obj - parseFloat( obj ) >= 0));
		},
	    //获取GMT格式的过期时间
	    getExpiresDate(days, hours, minutes, seconds) {
	    	var ExpiresDate = new Date();
	    	if (session.isNumber(days) && session.isNumber(hours) && session.isNumber(minutes)) {
	    		ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days));
	    		ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours));
	    		ExpiresDate.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes));
	    		if (session.isNumber(seconds)) {
	    			ExpiresDate.setSeconds(ExpiresDate.getSeconds() + parseInt(seconds));
	    		}
	    	}
	    	return ExpiresDate.toGMTString();
	    },
	    //解码
	    unescape(str){
	        return unescape(str||'');
	    },
	    //编码
	    escape(str){
	        return escape(str||'');
	    }
	};
	
	session.isClientWindow = typeof window !== 'undefined'&&window.window === window&&typeof window.document !== 'undefined';
	session.isLocalCookie = false;
	session.isLocalStorage = false;
	session.isSessionStorage = false;
	session.isLongStorage = false;
	if (session.isClientWindow) {
	    try{
	        session.isLocalCookie = 'cookie' in window.document;
	    }catch(e){}
	    try{
	        session.isLocalStorage = 'localStorage' in window;
	    }catch(e){}
	    try{
	        session.isSessionStorage = 'sessionStorage' in window;
	    }catch(e){}
	}
	//局部变量-是否为客户端窗口
	const isClientWindow = session.isClientWindow;
	//局部变量-本地cookie是否为客户端窗口支持
	const isLocalCookie = session.isLocalCookie;
	//局部变量-本地存储是否为客户端窗口支持
	const isLocalStorage = session.isLocalStorage;
	//局部变量-本地会话存储是否为客户端窗口支持
	const isSessionStorage = session.isSessionStorage;
	//api模块
	const api = __webpack_require__(1);
	//签名模块
	const sign = __webpack_require__(5);
	//请求模块
	const request = __webpack_require__(4);
	const cryptoJsCore = __webpack_require__(7);
	const cryptoJsBase64 = __webpack_require__(8);
	const cryptoJsUtf8 = __webpack_require__(9);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory();
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define([], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	}(this, function () {
	
		/**
		 * CryptoJS core components.
		 */
		var CryptoJS = CryptoJS || (function (Math, undefined) {
		    /*
		     * Local polyfil of Object.create
		     */
		    var create = Object.create || (function () {
		        function F() {};
	
		        return function (obj) {
		            var subtype;
	
		            F.prototype = obj;
	
		            subtype = new F();
	
		            F.prototype = null;
	
		            return subtype;
		        };
		    }())
	
		    /**
		     * CryptoJS namespace.
		     */
		    var C = {};
	
		    /**
		     * Library namespace.
		     */
		    var C_lib = C.lib = {};
	
		    /**
		     * Base object for prototypal inheritance.
		     */
		    var Base = C_lib.Base = (function () {
	
	
		        return {
		            /**
		             * Creates a new object that inherits from this object.
		             *
		             * @param {Object} overrides Properties to copy into the new object.
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         field: 'value',
		             *
		             *         method: function () {
		             *         }
		             *     });
		             */
		            extend: function (overrides) {
		                // Spawn
		                var subtype = create(this);
	
		                // Augment
		                if (overrides) {
		                    subtype.mixIn(overrides);
		                }
	
		                // Create default initializer
		                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
		                    subtype.init = function () {
		                        subtype.$super.init.apply(this, arguments);
		                    };
		                }
	
		                // Initializer's prototype is the subtype object
		                subtype.init.prototype = subtype;
	
		                // Reference supertype
		                subtype.$super = this;
	
		                return subtype;
		            },
	
		            /**
		             * Extends this object and runs the init method.
		             * Arguments to create() will be passed to init().
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var instance = MyType.create();
		             */
		            create: function () {
		                var instance = this.extend();
		                instance.init.apply(instance, arguments);
	
		                return instance;
		            },
	
		            /**
		             * Initializes a newly created object.
		             * Override this method to add some logic when your objects are created.
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         init: function () {
		             *             // ...
		             *         }
		             *     });
		             */
		            init: function () {
		            },
	
		            /**
		             * Copies properties into this object.
		             *
		             * @param {Object} properties The properties to mix in.
		             *
		             * @example
		             *
		             *     MyType.mixIn({
		             *         field: 'value'
		             *     });
		             */
		            mixIn: function (properties) {
		                for (var propertyName in properties) {
		                    if (properties.hasOwnProperty(propertyName)) {
		                        this[propertyName] = properties[propertyName];
		                    }
		                }
	
		                // IE won't copy toString using the loop above
		                if (properties.hasOwnProperty('toString')) {
		                    this.toString = properties.toString;
		                }
		            },
	
		            /**
		             * Creates a copy of this object.
		             *
		             * @return {Object} The clone.
		             *
		             * @example
		             *
		             *     var clone = instance.clone();
		             */
		            clone: function () {
		                return this.init.prototype.extend(this);
		            }
		        };
		    }());
	
		    /**
		     * An array of 32-bit words.
		     *
		     * @property {Array} words The array of 32-bit words.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var WordArray = C_lib.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of 32-bit words.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.create();
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 4;
		            }
		        },
	
		        /**
		         * Converts this word array to a string.
		         *
		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
		         *
		         * @return {string} The stringified word array.
		         *
		         * @example
		         *
		         *     var string = wordArray + '';
		         *     var string = wordArray.toString();
		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
		         */
		        toString: function (encoder) {
		            return (encoder || Hex).stringify(this);
		        },
	
		        /**
		         * Concatenates a word array to this word array.
		         *
		         * @param {WordArray} wordArray The word array to append.
		         *
		         * @return {WordArray} This word array.
		         *
		         * @example
		         *
		         *     wordArray1.concat(wordArray2);
		         */
		        concat: function (wordArray) {
		            // Shortcuts
		            var thisWords = this.words;
		            var thatWords = wordArray.words;
		            var thisSigBytes = this.sigBytes;
		            var thatSigBytes = wordArray.sigBytes;
	
		            // Clamp excess bits
		            this.clamp();
	
		            // Concat
		            if (thisSigBytes % 4) {
		                // Copy one byte at a time
		                for (var i = 0; i < thatSigBytes; i++) {
		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
		                }
		            } else {
		                // Copy one word at a time
		                for (var i = 0; i < thatSigBytes; i += 4) {
		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
		                }
		            }
		            this.sigBytes += thatSigBytes;
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Removes insignificant bits.
		         *
		         * @example
		         *
		         *     wordArray.clamp();
		         */
		        clamp: function () {
		            // Shortcuts
		            var words = this.words;
		            var sigBytes = this.sigBytes;
	
		            // Clamp
		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		            words.length = Math.ceil(sigBytes / 4);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = wordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone.words = this.words.slice(0);
	
		            return clone;
		        },
	
		        /**
		         * Creates a word array filled with random bytes.
		         *
		         * @param {number} nBytes The number of random bytes to generate.
		         *
		         * @return {WordArray} The random word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
		         */
		        random: function (nBytes) {
		            var words = [];
	
		            var r = (function (m_w) {
		                var m_w = m_w;
		                var m_z = 0x3ade68b1;
		                var mask = 0xffffffff;
	
		                return function () {
		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
		                    var result = ((m_z << 0x10) + m_w) & mask;
		                    result /= 0x100000000;
		                    result += 0.5;
		                    return result * (Math.random() > .5 ? 1 : -1);
		                }
		            });
	
		            for (var i = 0, rcache; i < nBytes; i += 4) {
		                var _r = r((rcache || Math.random()) * 0x100000000);
	
		                rcache = _r() * 0x3ade67b7;
		                words.push((_r() * 0x100000000) | 0);
		            }
	
		            return new WordArray.init(words, nBytes);
		        }
		    });
	
		    /**
		     * Encoder namespace.
		     */
		    var C_enc = C.enc = {};
	
		    /**
		     * Hex encoding strategy.
		     */
		    var Hex = C_enc.Hex = {
		        /**
		         * Converts a word array to a hex string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The hex string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var hexChars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                hexChars.push((bite >>> 4).toString(16));
		                hexChars.push((bite & 0x0f).toString(16));
		            }
	
		            return hexChars.join('');
		        },
	
		        /**
		         * Converts a hex string to a word array.
		         *
		         * @param {string} hexStr The hex string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
		         */
		        parse: function (hexStr) {
		            // Shortcut
		            var hexStrLength = hexStr.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < hexStrLength; i += 2) {
		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		            }
	
		            return new WordArray.init(words, hexStrLength / 2);
		        }
		    };
	
		    /**
		     * Latin1 encoding strategy.
		     */
		    var Latin1 = C_enc.Latin1 = {
		        /**
		         * Converts a word array to a Latin1 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Latin1 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var latin1Chars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                latin1Chars.push(String.fromCharCode(bite));
		            }
	
		            return latin1Chars.join('');
		        },
	
		        /**
		         * Converts a Latin1 string to a word array.
		         *
		         * @param {string} latin1Str The Latin1 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
		         */
		        parse: function (latin1Str) {
		            // Shortcut
		            var latin1StrLength = latin1Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < latin1StrLength; i++) {
		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		            }
	
		            return new WordArray.init(words, latin1StrLength);
		        }
		    };
	
		    /**
		     * UTF-8 encoding strategy.
		     */
		    var Utf8 = C_enc.Utf8 = {
		        /**
		         * Converts a word array to a UTF-8 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-8 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            try {
		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		            } catch (e) {
		                throw new Error('Malformed UTF-8 data');
		            }
		        },
	
		        /**
		         * Converts a UTF-8 string to a word array.
		         *
		         * @param {string} utf8Str The UTF-8 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
		         */
		        parse: function (utf8Str) {
		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		        }
		    };
	
		    /**
		     * Abstract buffered block algorithm template.
		     *
		     * The property blockSize must be implemented in a concrete subtype.
		     *
		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
		     */
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		        /**
		         * Resets this block algorithm's data buffer to its initial state.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm.reset();
		         */
		        reset: function () {
		            // Initial values
		            this._data = new WordArray.init();
		            this._nDataBytes = 0;
		        },
	
		        /**
		         * Adds new data to this block algorithm's buffer.
		         *
		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm._append('data');
		         *     bufferedBlockAlgorithm._append(wordArray);
		         */
		        _append: function (data) {
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof data == 'string') {
		                data = Utf8.parse(data);
		            }
	
		            // Append
		            this._data.concat(data);
		            this._nDataBytes += data.sigBytes;
		        },
	
		        /**
		         * Processes available data blocks.
		         *
		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
		         *
		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
		         *
		         * @return {WordArray} The processed data.
		         *
		         * @example
		         *
		         *     var processedData = bufferedBlockAlgorithm._process();
		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
		         */
		        _process: function (doFlush) {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var dataSigBytes = data.sigBytes;
		            var blockSize = this.blockSize;
		            var blockSizeBytes = blockSize * 4;
	
		            // Count blocks ready
		            var nBlocksReady = dataSigBytes / blockSizeBytes;
		            if (doFlush) {
		                // Round up to include partial blocks
		                nBlocksReady = Math.ceil(nBlocksReady);
		            } else {
		                // Round down to include only full blocks,
		                // less the number of blocks that must remain in the buffer
		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		            }
	
		            // Count words ready
		            var nWordsReady = nBlocksReady * blockSize;
	
		            // Count bytes ready
		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
	
		            // Process blocks
		            if (nWordsReady) {
		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
		                    // Perform concrete-algorithm logic
		                    this._doProcessBlock(dataWords, offset);
		                }
	
		                // Remove processed words
		                var processedWords = dataWords.splice(0, nWordsReady);
		                data.sigBytes -= nBytesReady;
		            }
	
		            // Return processed words
		            return new WordArray.init(processedWords, nBytesReady);
		        },
	
		        /**
		         * Creates a copy of this object.
		         *
		         * @return {Object} The clone.
		         *
		         * @example
		         *
		         *     var clone = bufferedBlockAlgorithm.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone._data = this._data.clone();
	
		            return clone;
		        },
	
		        _minBufferSize: 0
		    });
	
		    /**
		     * Abstract hasher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
		     */
		    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Initializes a newly created hasher.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
		         *
		         * @example
		         *
		         *     var hasher = CryptoJS.algo.SHA256.create();
		         */
		        init: function (cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this hasher to its initial state.
		         *
		         * @example
		         *
		         *     hasher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-hasher logic
		            this._doReset();
		        },
	
		        /**
		         * Updates this hasher with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {Hasher} This hasher.
		         *
		         * @example
		         *
		         *     hasher.update('message');
		         *     hasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            // Append
		            this._append(messageUpdate);
	
		            // Update the hash
		            this._process();
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the hash computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The hash.
		         *
		         * @example
		         *
		         *     var hash = hasher.finalize();
		         *     var hash = hasher.finalize('message');
		         *     var hash = hasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Final message update
		            if (messageUpdate) {
		                this._append(messageUpdate);
		            }
	
		            // Perform concrete-hasher logic
		            var hash = this._doFinalize();
	
		            return hash;
		        },
	
		        blockSize: 512/32,
	
		        /**
		         * Creates a shortcut function to a hasher's object interface.
		         *
		         * @param {Hasher} hasher The hasher to create a helper for.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
		         */
		        _createHelper: function (hasher) {
		            return function (message, cfg) {
		                return new hasher.init(cfg).finalize(message);
		            };
		        },
	
		        /**
		         * Creates a shortcut function to the HMAC's object interface.
		         *
		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
		         */
		        _createHmacHelper: function (hasher) {
		            return function (message, key) {
		                return new C_algo.HMAC.init(hasher, key).finalize(message);
		            };
		        }
		    });
	
		    /**
		     * Algorithm namespace.
		     */
		    var C_algo = C.algo = {};
	
		    return C;
		}(Math));
	
	
		return CryptoJS;
	
	}));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_enc = C.enc;
	
		    /**
		     * Base64 encoding strategy.
		     */
		    var Base64 = C_enc.Base64 = {
		        /**
		         * Converts a word array to a Base64 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Base64 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
		            var map = this._map;
	
		            // Clamp excess bits
		            wordArray.clamp();
	
		            // Convert
		            var base64Chars = [];
		            for (var i = 0; i < sigBytes; i += 3) {
		                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
		                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
		                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
	
		                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
	
		                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
		                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
		                }
		            }
	
		            // Add padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                while (base64Chars.length % 4) {
		                    base64Chars.push(paddingChar);
		                }
		            }
	
		            return base64Chars.join('');
		        },
	
		        /**
		         * Converts a Base64 string to a word array.
		         *
		         * @param {string} base64Str The Base64 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
		         */
		        parse: function (base64Str) {
		            // Shortcuts
		            var base64StrLength = base64Str.length;
		            var map = this._map;
		            var reverseMap = this._reverseMap;
	
		            if (!reverseMap) {
		                    reverseMap = this._reverseMap = [];
		                    for (var j = 0; j < map.length; j++) {
		                        reverseMap[map.charCodeAt(j)] = j;
		                    }
		            }
	
		            // Ignore padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                var paddingIndex = base64Str.indexOf(paddingChar);
		                if (paddingIndex !== -1) {
		                    base64StrLength = paddingIndex;
		                }
		            }
	
		            // Convert
		            return parseLoop(base64Str, base64StrLength, reverseMap);
	
		        },
	
		        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		    };
	
		    function parseLoop(base64Str, base64StrLength, reverseMap) {
		      var words = [];
		      var nBytes = 0;
		      for (var i = 0; i < base64StrLength; i++) {
		          if (i % 4) {
		              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
		              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
		              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
		              nBytes++;
		          }
		      }
		      return WordArray.create(words, nBytes);
		    }
		}());
	
	
		return CryptoJS.enc.Base64;
	
	}));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		return CryptoJS.enc.Utf8;
	
	}));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    headersPrefix: 'x-ddv-',
	    excludeHeaderKeys: ['host','content-length','content-type','content-md5'],
	    //签名头
	    _signRun(o){
	        return new api.Promise(function signInit(resolve, reject) {
	            //base初始化
	            sign._signRunBaseInit(o);
	            //初始化GET参数
	            sign._signRunQueryInit(o);
	            //格式化头信息
	            sign._signRunHeadersFormat(o);
	            //签名头排序
	            sign._signRunHeadersSort(o);
	            //提交下一步
	            resolve(o);
	            o = void 0;
	        }).then(function (o) {
	            //获取
	            return session.getTrueData(o);
	        }).then(function (o) {
	            console.log('呵呵');
	        });
	    },
	    //签名头排序
	    _signRunHeadersSort(o){
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
	
	        //排序
			o.authCanonicalHeadersStr.sort();
			//用\n拼接
			o.authCanonicalHeadersStr = o.authCanonicalHeadersStr.join(o.n);
			//用;拼接
			o.authHeadersStr = o.authHeadersStr.join(';');
	    },
	    //格式化头信息
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
	    md5Hex(str, isToString){
	        str = str || '';
	        if (isToString!==false) {
	            str = str.toString();
	        }
	        return cryptoJsCore.MD5(str).toString(cryptoJsHex);
	    },
	    md5Base64(str, isToString){
	        str = str || '';
	        if (isToString!==false) {
	            str = str.toString();
	        }
	        return cryptoJsCore.MD5(str).toString(cryptoJsBase64);
	    },
	    HmacSHA256(str, key, isToString){
	        str = str || '';
	        if (isToString!==false) {
	            str = str.toString();
	        }
	        return cryptoJsCore.HmacSHA256(str,key).toString(cryptoJsHex);
	    }
	};
	const api = __webpack_require__(1);
	const sign = __webpack_require__(5);
	const request = __webpack_require__(4);
	const session = __webpack_require__(6);
	const cryptoJsCore = __webpack_require__(7);
	const cryptoJsMd5 = __webpack_require__(11);
	const cryptoJsHmacSha256 = __webpack_require__(12);
	const cryptoJsBase64 = __webpack_require__(8);
	const cryptoJsHex = __webpack_require__(15);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Constants table
		    var T = [];
	
		    // Compute constants
		    (function () {
		        for (var i = 0; i < 64; i++) {
		            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
		        }
		    }());
	
		    /**
		     * MD5 hash algorithm.
		     */
		    var MD5 = C_algo.MD5 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];
	
		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }
	
		            // Shortcuts
		            var H = this._hash.words;
	
		            var M_offset_0  = M[offset + 0];
		            var M_offset_1  = M[offset + 1];
		            var M_offset_2  = M[offset + 2];
		            var M_offset_3  = M[offset + 3];
		            var M_offset_4  = M[offset + 4];
		            var M_offset_5  = M[offset + 5];
		            var M_offset_6  = M[offset + 6];
		            var M_offset_7  = M[offset + 7];
		            var M_offset_8  = M[offset + 8];
		            var M_offset_9  = M[offset + 9];
		            var M_offset_10 = M[offset + 10];
		            var M_offset_11 = M[offset + 11];
		            var M_offset_12 = M[offset + 12];
		            var M_offset_13 = M[offset + 13];
		            var M_offset_14 = M[offset + 14];
		            var M_offset_15 = M[offset + 15];
	
		            // Working varialbes
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
	
		            // Computation
		            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
		            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
		            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
		            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
		            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
		            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
		            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
		            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
		            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
		            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
		            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
		            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
		            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
		            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
		            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
		            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
	
		            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
		            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
		            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
		            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
		            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
		            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
		            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
		            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
		            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
		            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
		            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
		            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
		            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
		            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
		            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
		            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
	
		            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
		            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
		            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
		            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
		            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
		            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
		            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
		            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
		            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
		            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
		            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
		            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
		            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
		            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
		            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
		            b = HH(b, c, d, a, M_offset_2,  23, T[47]);
	
		            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
		            d = II(d, a, b, c, M_offset_7,  10, T[49]);
		            c = II(c, d, a, b, M_offset_14, 15, T[50]);
		            b = II(b, c, d, a, M_offset_5,  21, T[51]);
		            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
		            d = II(d, a, b, c, M_offset_3,  10, T[53]);
		            c = II(c, d, a, b, M_offset_10, 15, T[54]);
		            b = II(b, c, d, a, M_offset_1,  21, T[55]);
		            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
		            d = II(d, a, b, c, M_offset_15, 10, T[57]);
		            c = II(c, d, a, b, M_offset_6,  15, T[58]);
		            b = II(b, c, d, a, M_offset_13, 21, T[59]);
		            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
		            d = II(d, a, b, c, M_offset_11, 10, T[61]);
		            c = II(c, d, a, b, M_offset_2,  15, T[62]);
		            b = II(b, c, d, a, M_offset_9,  21, T[63]);
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	
		            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
		            var nBitsTotalL = nBitsTotal;
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
		                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
		            );
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
		            );
	
		            data.sigBytes = (dataWords.length + 1) * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;
	
		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                // Shortcut
		                var H_i = H[i];
	
		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    function FF(a, b, c, d, x, s, t) {
		        var n = a + ((b & c) | (~b & d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function GG(a, b, c, d, x, s, t) {
		        var n = a + ((b & d) | (c & ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function HH(a, b, c, d, x, s, t) {
		        var n = a + (b ^ c ^ d) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function II(a, b, c, d, x, s, t) {
		        var n = a + (c ^ (b | ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.MD5('message');
		     *     var hash = CryptoJS.MD5(wordArray);
		     */
		    C.MD5 = Hasher._createHelper(MD5);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacMD5(message, key);
		     */
		    C.HmacMD5 = Hasher._createHmacHelper(MD5);
		}(Math));
	
	
		return CryptoJS.MD5;
	
	}));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7), __webpack_require__(13), __webpack_require__(14));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha256", "./hmac"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		return CryptoJS.HmacSHA256;
	
	}));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Initialization and round constants tables
		    var H = [];
		    var K = [];
	
		    // Compute constants
		    (function () {
		        function isPrime(n) {
		            var sqrtN = Math.sqrt(n);
		            for (var factor = 2; factor <= sqrtN; factor++) {
		                if (!(n % factor)) {
		                    return false;
		                }
		            }
	
		            return true;
		        }
	
		        function getFractionalBits(n) {
		            return ((n - (n | 0)) * 0x100000000) | 0;
		        }
	
		        var n = 2;
		        var nPrime = 0;
		        while (nPrime < 64) {
		            if (isPrime(n)) {
		                if (nPrime < 8) {
		                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
		                }
		                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
	
		                nPrime++;
		            }
	
		            n++;
		        }
		    }());
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-256 hash algorithm.
		     */
		    var SHA256 = C_algo.SHA256 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init(H.slice(0));
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
		            var f = H[5];
		            var g = H[6];
		            var h = H[7];
	
		            // Computation
		            for (var i = 0; i < 64; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var gamma0x = W[i - 15];
		                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
		                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
		                                   (gamma0x >>> 3);
	
		                    var gamma1x = W[i - 2];
		                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
		                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
		                                   (gamma1x >>> 10);
	
		                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
		                }
	
		                var ch  = (e & f) ^ (~e & g);
		                var maj = (a & b) ^ (a & c) ^ (b & c);
	
		                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
		                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));
	
		                var t1 = h + sigma1 + ch + K[i] + W[i];
		                var t2 = sigma0 + maj;
	
		                h = g;
		                g = f;
		                f = e;
		                e = (d + t1) | 0;
		                d = c;
		                c = b;
		                b = a;
		                a = (t1 + t2) | 0;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		            H[5] = (H[5] + f) | 0;
		            H[6] = (H[6] + g) | 0;
		            H[7] = (H[7] + h) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA256('message');
		     *     var hash = CryptoJS.SHA256(wordArray);
		     */
		    C.SHA256 = Hasher._createHelper(SHA256);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA256(message, key);
		     */
		    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
		}(Math));
	
	
		return CryptoJS.SHA256;
	
	}));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var C_enc = C.enc;
		    var Utf8 = C_enc.Utf8;
		    var C_algo = C.algo;
	
		    /**
		     * HMAC algorithm.
		     */
		    var HMAC = C_algo.HMAC = Base.extend({
		        /**
		         * Initializes a newly created HMAC.
		         *
		         * @param {Hasher} hasher The hash algorithm to use.
		         * @param {WordArray|string} key The secret key.
		         *
		         * @example
		         *
		         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
		         */
		        init: function (hasher, key) {
		            // Init hasher
		            hasher = this._hasher = new hasher.init();
	
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof key == 'string') {
		                key = Utf8.parse(key);
		            }
	
		            // Shortcuts
		            var hasherBlockSize = hasher.blockSize;
		            var hasherBlockSizeBytes = hasherBlockSize * 4;
	
		            // Allow arbitrary length keys
		            if (key.sigBytes > hasherBlockSizeBytes) {
		                key = hasher.finalize(key);
		            }
	
		            // Clamp excess bits
		            key.clamp();
	
		            // Clone key for inner and outer pads
		            var oKey = this._oKey = key.clone();
		            var iKey = this._iKey = key.clone();
	
		            // Shortcuts
		            var oKeyWords = oKey.words;
		            var iKeyWords = iKey.words;
	
		            // XOR keys with pad constants
		            for (var i = 0; i < hasherBlockSize; i++) {
		                oKeyWords[i] ^= 0x5c5c5c5c;
		                iKeyWords[i] ^= 0x36363636;
		            }
		            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this HMAC to its initial state.
		         *
		         * @example
		         *
		         *     hmacHasher.reset();
		         */
		        reset: function () {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Reset
		            hasher.reset();
		            hasher.update(this._iKey);
		        },
	
		        /**
		         * Updates this HMAC with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {HMAC} This HMAC instance.
		         *
		         * @example
		         *
		         *     hmacHasher.update('message');
		         *     hmacHasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            this._hasher.update(messageUpdate);
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the HMAC computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The HMAC.
		         *
		         * @example
		         *
		         *     var hmac = hmacHasher.finalize();
		         *     var hmac = hmacHasher.finalize('message');
		         *     var hmac = hmacHasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Compute HMAC
		            var innerHash = hasher.finalize(messageUpdate);
		            hasher.reset();
		            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
	
		            return hmac;
		        }
		    });
		}());
	
	
	}));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(7));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		return CryptoJS.enc.Hex;
	
	}));

/***/ }
/******/ ]);
//# sourceMappingURL=api.js.map