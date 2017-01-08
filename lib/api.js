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
    query(data){
		this.query = this.query || Object.create(null);
        Object.assign(this.query, data||Object.create(null));
		return this;
	}
};
api.url = require('./url.js');
api.request = require('./request.js');
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
