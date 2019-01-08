'use strict'

const request = require('node-fetch'),
  util = require('../utils/common');

class Http {
  constructor(url) {
    this.jsonrpcVer = '2.0';
    this.url = url;
  }

  send(option = {}) {
    let opt = {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: {
        jsonrpc: option.jsonrpcVer || this.jsonrpcVer,
        id: util.generateUuid(),
        method: option.bcMethod,
        params: option.params
      }
    }
    opt.body = JSON.stringify(opt.body);

    return request(this.url, opt)
      .then(res => {
        if (res.status === 502) {
          return Promise.resolve([res.status, {}])
        }
        return Promise.all([
          Promise.resolve(res.status),
          res.json()
        ])
      })
      .then(statusNBody => {
        return {
          statusCode: statusNBody[0],
          body: statusNBody[1]
        }
      })
      .catch(e => {
        throw e;
      });
  }
}

module.exports = Http;