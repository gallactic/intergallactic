'use strict'

const request = require('request'),
  util = require('../utils/common');

class Http {
  constructor(url) {
    this.jsonrpcVer = '2.0';
    this.url = url;
  }

  send(option = {}) {
    return new Promise((resolve, reject) => {
      let opt = {
        url: option.url || option.uri || this.url,
        method: option.method || 'POST',
        json: true,
        body: {
          jsonrpc: option.jsonrpcVer || this.jsonrpcVer,
          id: util.generateUuid(),
          method: option.burrowMethod,
          params: option.params
        }
      }

      request.post(opt, function (err, res, body) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }
}

module.exports = Http;