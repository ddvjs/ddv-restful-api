# restful-api
>这是一个基于[Promise](https://www.promisejs.org/)封装的请求模块

## 安装

**npm:**

```shell
$ npm install ddv-restful-api
```

**独立版本:**

你可以直接使用`<script>`标签直接引入

```html
<script src="https://unpkg.com/ddv-restful-api/dist/api.js"></script>
```

Note that the [es5-shim](https://github.com/es-shims/es5-shim) must be loaded before this library to support browsers pre IE9.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
```



## 配置

```javascript
import * as api from 'ddv-restful-api';
api.setBaseUrl('http://api.abctest.com');
api.setHeadersPrefix('x-ddv-');
api.setLongStorage(false);

```

## 使用

>* `restful-api` 支持 `GET`、`POST`、`PUT`、`DELETE`四种请求方式，以及拥有 `get`、`post`、`put`、 `del`（或 `delete`）、`api`五个方法。
>* 分别使用方法 `get`、`post`、`put`、 `del`（或 `delete`）执行对应的请求。
>* `api`方法支持模拟`GET`、`POST`、`PUT`、`DELETE` 以及更多请求方式。
>* `api.setSessionInitTrySum`设置会话初始化最大自动尝试次数


### 例子：
##### 1、GET请求

>* `send` 发送的数据会自动转换为 `query` 服务器GET参数
>* `headers()` 方法改变请求头：`api.get('/path').headers({})`。
>* `path()`方法可以改变请求的path：`api.get('/path').path('/path2')`。
>* `query()` 方法就是发送地址栏 `？` 后面的参数
>* `sendData()` 方法
>* `req()`# restful-api
>这是一个基于[Promise](https://www.promisejs.org/)封装的请求模块

## 安装

**npm:**

```shell
$ npm install ddv-restful-api
```
<!--
**独立版本:**

你可以直接使用`<script>`标签直接引入

```html
<script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
```

Note that the [es5-shim](https://github.com/es-shims/es5-shim) must be loaded before this library to support browsers pre IE9.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.min.js"></script>
```

-->

## 配置

```javascript
import * as api from 'ddv-restful-api';
api.setBaseUrl('http://api.warder.ping-qu.com');
api.setHeadersPrefix('x-hz-');
api.setLongStorage(false);

```

## 使用

>* `restful-api` 支持 `GET`、`POST`、`PUT`、`DELETE`四种请求方式，以及拥有 `get`、`post`、`put`、 `del`（或 `delete`）、`api`五个方法。
>* 分别使用方法 `get`、`post`、`put`、 `del`（或 `delete`）执行对应的请求。
>* `api`方法支持模拟`GET`、`POST`、`PUT`、`DELETE` 以及更多请求方式。


### 例子：
##### 1、GET请求

>* `send` 发送的数据会自动转换为 `query` 服务器GET参数
>* `headers()` ：改变请求头：`api.get('/path').headers({})`。
>* `path()`：可以改变请求的path：`api.get('/path').path('/path2')`。
>* `query()` ：发送地址栏 `？` 后面的参数
>* `sendData()` ：`send`方法是 `sendData`一个别名
>* `req()`、`res()`： 如果在`node`服务器建立`http`服务，需要设置`req`和`res`来确定会话
>* `context()`： 这个是res和req的集合context({'req','res'})

```javascript
import api from 'ddv-restful-api';

//支持多维数组
api.get('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```
>* 小提示如果您仅仅是使用get请求你可以选择

```javascript
import {get as getApi} from 'ddv-restful-api';

//支持多维数组
getApi('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});

```
>* 温馨提示:getApi是别名

##### 2、POST请求

>* 类似GET，但是 `POST`、`PUT`、`DELETE` 支持 query() 和 send()
>* query 是服务器GET参数
>* send 是服务器POST参数，也就是请求体

```javascript
import {post as postApi} from 'ddv-restful-api';

//支持多维数组
postApi('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```

##### 3、使用api方法请求

>* 与上述例子类似
>* 可使用 `method()` 方法更改请示方式，默认是 `GET`。

```javascript
import api from 'ddv-restful-api';

//支持多维数组
api('/v1_0/pc/raiders/news/type').method('PUT').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```


```javascript
import api from 'ddv-restful-api';

//支持多维数组
api.get('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```
>* 小提示如果您仅仅是使用get请求你可以选择

```javascript
import {get as getApi} from 'ddv-restful-api';

//支持多维数组
getApi('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});

```
>* 温馨提示:getApi是别名

##### 2、POST请求

>* 类似GET，但是 `POST`、`PUT`、`DELETE` 支持 query() 和 send()
>* query 是服务器GET参数
>* send 是服务器POST参数，也就是请求体

```javascript
import {post as postApi} from 'ddv-restful-api';

//支持多维数组
postApi('/v1_0/pc/raiders/news/type').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```

##### 3、使用api方法请求

>* 与上述例子类似
>* 可使用 `method()` 方法更改请示方式，默认是 `GET`。

```javascript
import api from 'ddv-restful-api';

//支持多维数组
api('/v1_0/pc/raiders/news/type').method('PUT').send({
    'array':[
        '1',
        '2',
        '3',
        {
            'test':'ddv',
            'ddvjs':['a','b','c']
        }
    ]
}).then(function(res){
	console.log('结果:',res);
}).catch(function(e){
	console.log('e',e.statusCode);
	console.log('e',e.message);
});
```
