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
    md5Base64(str){
        return 's';
    }
};
const api = require('./api.js');
const sign = require('./sign.js');
const request = require('./request.js');
const session = require('./session.js');
