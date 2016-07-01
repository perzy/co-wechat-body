# co-wechat-body

[![npm version](https://badge.fury.io/js/co-wechat-body.svg)](https://badge.fury.io/js/co-wechat-body)

> Parse wechat xml request body for Koa

## Install

[![NPM](https://nodei.co/npm/co-wechat-body.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/co-wechat-body/)

## Usage

```js
const koa = require('koa');
const wechatBodyParser = require('co-wechat-body');

const app = koa();
app.use(wechatBodyParser(<options>));

app.use(function *() {
    // the parsed body will store in this.request.body
    // if nothing was parsed, body will be undefined
    this.body = this.request.body;
});
```

`co-wechat-body` will carefully check and set `this.request.body`, so it can **intergate** well with other body parsers such as `koa-bodyparser`:

```js
// ...
const bodyParser = require('koa-bodyparser');

// ...
app.use(wechatBodyParser(<options>));
app.use(bodyParser());
```

## Example

http request raw body:

```
<xml>   
  <return_code><![CDATA[SUCCESS]]></return_code>  
  <return_msg><![CDATA[OK]]></return_msg> 
</xml>
```

parse result, this.request.body:

```
{
  "return_code": "SUCCESS",
  "return_msg": "OK"
}
```


## Options

Please refer to (https://www.npmjs.com/package/koa-xml-body#options)

- **encoding**: requested encoding. Default is `utf8`. If not set, the lib will retrive it from `content-type`(such as `content-type:application/xml;charset=gb2312`).
- **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `1mb`.
- **length**: length of the body. When `content-length` is found, it will be overwritten automatically.
- **onerror**: error handler. Default is a `noop` function. It means it will **eat** the error silently. You can config it to customize the response.

```js
app.use(xmlParser({
    limit: 128,
    length: 200, // '1mb'|1024... If not sure about the effect, just leave it unspecified
    encoding: 'utf8', // lib will detect it from `content-type`
    onerror: (err, ctx) => {
        ctx.throw(err.status, err.message);
    }
}));
```


## Licences

[MIT](LICENSE)