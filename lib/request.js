const url = require('./url.js');
const request = module.exports = function request(o, callback) {
    return new request.Request(o, callback);
};
const Request = request.Request = class ddvRequest {
    constructor(o, callback) {
        this.input_o = o ;
		this.method = o._method ||'GET' ;
		this.headers = o._headers || Object.create(null);
		this.data = o._data || Object.create(null);
		this.queryObject = o._query || Object.create(null);
		this.path = o._path || '/' ;
		this.path = (this.path.charAt(0)=='/'?'':'/') + this.path;
		this.query = (url('query',this.path)||'').toString();
		this.path = url('path',this.path)||'/';
        this.baseUrl = o.baseUrl || this.baseUrl || Request.baseUrl || (Request.api&&Request.api.baseUrl) || '';
        this._callback = callback ;

		this.host = url('hostname',this.baseUrl);
		this.port = url('port',this.baseUrl);
		this.protocol = url('protocol',this.baseUrl);
        this.request_id = this.request_id || request.createRequestId();

        this.query += (this.query.length>0?'&':'')+request.param(this.queryObject);
        if (this.method==='GET') {
            this.query += (this.query.length>0?'&':'')+request.param(this.data);
        }else{
            this.body = request.param(this.data);
        }
        this._run();
    }
    _run(){
        console.log(8555,this);
    }
}

request.param = function (data) {
    return '3';
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
