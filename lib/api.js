'use strict';
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
    }).then(function(_request){
        return new api.Promise(function(resolve, reject) {
            var r = null, e = null, code = 0, res = _request.serverRes;
            code = res.statusCode ;
            try{
                r = JSON.parse(res.body) ;
            }catch(e1){
                e = e1;
            }
            if (e) {
                e.code = res.statusCode ;
                e.error_id = res.status ;
                e.message = res.status || 'Unknow Error' ;
                reject(e);
            }else if (r) {
                if (r.state) {
                    r.code = r.code || res.statusCode;
                    r.error_id = r.error_id || res.status;
                    r.message = r.message || r.msg || res.status || 'Unknow Error' ;
                    resolve(r);
                }else{
                    e = new Error(r.message || r.msg || res.status || 'Unknow Error');
                    e.code = r.code || res.statusCode ;
                    e.error_id = r.error_id || res.status;
                    e.message = r.message || r.msg || res.status || 'Unknow Error' ;
                    reject(e);
                }
            }
            _request.destroy();
            _request = resolve = reject = r = e = code =res = void 0 ;
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
const url = api.url = require('./url.js');
const request = api.request = require('./request.js');
const sign = api.sign = require('./sign.js');
const session = api.session = require('./session.js');
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
    _apiDestroy(){
        api.nextTick.call(this, function(){
            var key;
        	for (key in this) {
        		if (!Object.hasOwnProperty.call(this,key)) continue;
        		delete this[key];
        	}
            key = void 0;
        });
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
