'use strict'

const Http = require('./http'),
  Grpc = require('./grpc');

/**
 * Connection class that act as a wrapper for http connection
 * or grpc connection (not implemented yet)
 */
class Connection {
  /**
   * Set up connection based on given blockchain node uri and protocol
   * @param {String} url an url string of the blockchain node
   * @param {String} protocol a protocol string (e.g. "jsonrpc" or "grpc")
   */
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