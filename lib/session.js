const session = module.exports = {
    getData(o){
        return new api.Promise(function(resolve, reject) {
            console.log('开发中')
            resolve('resolve');
        });
    },
    getTrueData(o){
        return session.getData(o);
    }
};
const api = require('./api.js');
const sign = require('./sign.js');
const request = require('./request.js');
