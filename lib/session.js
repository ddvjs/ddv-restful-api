const cbs = [];
let _getSessionTrueDataCbsIng = false;
const session = module.exports = {
    //获取正确的会话数据
    getTrueData(o){
        return new api.Promise(function(resolve, reject) {
            var isRun = false ;
            //处理回调
            if (o.isServerNode) {
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
    //获取正确的会话数据-开始运行
    _getTrueDataRun(o){
        session.getData(o).then(function(o){
            //检测会话是否过期
            return new api.Promise(function(resolve, reject) {
                var isSessionDataPass = true ;
                    //o.isSessionInit 是否强制
                    isSessionDataPass = isSessionDataPass&&(!o.isSessionInit);
                    //基本需要的数据检测
                    isSessionDataPass = isSessionDataPass&&o.sessionData&&o.sessionData.session_id&&o.sessionData.session_key&&o.sessionData.session_card;
                    //检测事件
                    isSessionDataPass = isSessionDataPass&&o.sessionData.expires_time&&request.time()<(o.sessionData.expires_time-5);
    			//为了保证没有问题，提前5秒钟过期
    			if (isSessionDataPass){
    				//下一步
    				resolve(o);
    			}else{
                    //重新初始化
                    o.isSessionInit = undefined ;
                    console.log('呵呵，过期了')
                    a.api.sessionInit.call(this,function(){
                        //下一步
                        q.nextToName('getSessionDataRun');
                    },function(e){
                        reject(e);
                    });
    			}
            });
        }).then(function(o){
            //批量回调成功
            var cbt;
            if (o.req&&o.req._getSessionTrueDataCbs) {
                while(cbt=o.req._getSessionTrueDataCbs.shift()){
                    if (cbt&&cbt[0]&&typeof cbt[0]==='function') {
                        cbt[0](o);
                    }
                    cbt = void 0;
                }
            }else if(session.isClientWindow&&cbs){
                while(cbt=cbs.shift()){
                    if (cbt&&cbt[0]&&typeof cbt[0]==='function') {
                        cbt[0](o);
                    }
                    cbt = void 0;
                }
            }
            o = void 0;
        }).catch(function(e){
            //批量回调异常
            var cbt;
            if (o.req&&o.req._getSessionTrueDataCbs) {
                while(cbt=o.req._getSessionTrueDataCbs.shift()){
                    if (cbt&&cbt[1]&&typeof cbt[1]==='function') {
                        cbt[1](e);
                    }
                    cbt = void 0;
                }
            }else if(session.isClientWindow&&cbs){
                while(cbt=cbs.shift()){
                    if (cbt&&cbt[1]&&typeof cbt[1]==='function') {
                        cbt[1](e);
                    }
                    cbt = void 0;
                }
            }
            e = void 0;
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
            if (o.isServerNode) {
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
const api = require('./api.js');
//签名模块
const sign = require('./sign.js');
//请求模块
const request = require('./request.js');
const cryptoJsCore = require('crypto-js/core');
const cryptoJsBase64 = require('crypto-js/enc-base64');
const cryptoJsUtf8 = require('crypto-js/enc-utf8');
