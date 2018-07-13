'use strict'

const Http = require('./http'),
  Grpc = require('./grpc');

class Connection {
  constructor (url, protocol) {
    this.url = url;
    this.protocol = protocol;

    if (this.protocol === 'jsonrpc') {
      this.connection = Object.setPrototypeOf(this, new Http(url));
    }
    else if (this.protocol === 'grpc') {
      this.connection = Object.setPrototypeOf(this, new Grpc(url));
    }
  }
}

module.exports = Connection;