'use strict';

const debug = require('debug')('co-wechat-body')
const xmlParser = require('koa-xml-body').default;

module.exports = (options) => {
  return function* wechatXmlParser(next) {
    if(isBodyParsed(this.request.body)){
      debug('body already parsed: %j', this.request.body);
      return yield next;
    }

    // parse it
    debug('parse wechat body...');
    delete this.request.body;
    yield xmlParser(options).call(this, formater.call(this, next));
  }
};

function isBodyParsed(body){
  return body && Object.keys(body).length > 0;
}

function* formater(next) {
  // this.request.body is parsed from koa-xml-body
  if(this.request.body && this.request.body.xml){
    this.request.body = formatMessage(this.request.body.xml);
  }
 
  debug('parse finish, the body is: %j', this.request.body);
  yield next;
}

function formatMessage(result) {
  const message = {};
  if (typeof result === 'object') {
    for (let key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue;
      }
      if (result[key].length === 1) {
        let val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        result[key].forEach( (item) => {
          message[key].push(formatMessage(item));
        });
      }
    }
  }

  return message;
}