'use strict'

const util = require('../utils/common');

class Grpc {
  constructor(connection) {
    this.grpcVer = '0.0';
  }

  send(option = {}) {
    return new Promise((resolve, reject) => {
      return reject('GRPC currently not yet supported');
    });
  }
}

module.exports = Grpc;