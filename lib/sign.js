'use strict';
//导出签名模块
const sign = module.exports = function sign(o){
    return sign._signRun(o);
};
//引入请求模块
const request = require('./request.js');
const session = require('./session.js');
//引入签名运行模块
Object.assign(sign, require('./signRun.js'));
//引入签名会话模块
