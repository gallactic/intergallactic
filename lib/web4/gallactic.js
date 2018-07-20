'use strict'

const config = require('../config/constant'),
  bcMtd = config.burrow.blockchain.method;

class Gallactic {
  constructor(conn) {
    this.conn = conn;
  }

  getChainId() {
    let req = {
      burrowMethod: bcMtd.getChainId,
      params: {}
    };
    return this.conn.send(req);
  }

  getInfo() {
    let req = {
      burrowMethod: bcMtd.getBcInfo,
      params: {}
    };
    return this.conn.send(req);
  }

  getLatestBlock() {
    let req = {
      burrowMethod: bcMtd.getLatestBlock,
      params: {}
    };
    return this.conn.send(req)
  }

  getBlock(height) {
    let req = {
      burrowMethod: bcMtd.getBlock,
      params: { height }
    };
    return this.conn.send(req)
  }

  getBlockTxns(height) {
    let req = {
      burrowMethod: bcMtd.getBlockTransactions,
      params: { height }
    };
    return this.conn.send(req)
  }
}

module.exports = Gallactic