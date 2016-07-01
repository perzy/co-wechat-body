'use strict';

const xmlParser = require('koa-xml-body').default;

module.exports = (options) => {
  return function* wechatXmlParser(next) {
    if(this.request.body !== undefined){
      return yield next;
    }

    yield xmlParser(options).call(this, formater.call(this, next));
  }
};

function* formater(next) {
  // this.request.body is parsed from koa-xml-body
  if(this.request.body && this.request.body.xml){
    this.request.body = formatMessage(this.request.body.xml);
  }

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