'use strict';
const request = module.exports = function request(o, callback) {
    return new request.Request(o, callback);
};
const url = require('./url.js');
const sign = require('./sign.js');
const api = require('./api.js');
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
