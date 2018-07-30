'use strict'

const config = require('../config/constant'),
  bcMtd = config.burrow.blockchain.method;

/**
 * Interact with Gallactic node to get the info like latest block
 * chain or the node information iteself
 * @example
 * const gallactic = new Gallactic(conn);
 * gallactic.getChainId().then(chId => console.log(chId));
 */
class Gallactic {
  /**
   * Set up connection used to interact with the node
   * @param {Object} conn Connection instance object. Available under web4.conn
   */
  constructor(conn) {
    this.conn = conn;
  }

  /**
   * Get ChainId info
   * @returns {Object} object contains ChainId info
   */
  getChainId() {
    let req = {
      burrowMethod: bcMtd.getChainId,
      params: {}
    };
    return this.conn.send(req);
  }

  /**
   * Get Bc node info
   * @returns {Object} contains the node info e.g. latest block, version and etc
   */
  getInfo() {
    let req = {
      burrowMethod: bcMtd.getBcInfo,
      params: {}
    };
    return this.conn.send(req);
  }

  /**
   * Get latest block info
   * @returns {Object} contains latest block info e.g. height, hash, etc
   */
  getLatestBlock() {
    let req = {
      burrowMethod: bcMtd.getLatestBlock,
      params: {}
    };
    return this.conn.send(req)
  }

  /**
   * Get a block information based on given block height
   * @param {Number} height Block height
   * @returns {Object} block information
   */
  getBlock(height) {
    let req = {
      burrowMethod: bcMtd.getBlock,
      params: { height }
    };
    return this.conn.send(req)
  }

  /**
   * Get transactions information given block height
   * @param {Number} height block height
   * @returns {Object} block information
   */
  getBlockTxns(height) {
    let req = {
      burrowMethod: bcMtd.getBlockTxns,
      params: { height }
    };
    return this.conn.send(req)
  }
}

module.exports = Gallactic