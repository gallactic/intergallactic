'use strict'

const config = require('../config/constant'),
  bcMtd = config.gallactic.blockchain.method;

/**
 * Interact with Gallactic node to get the info like latest block
 * chain or the node information iteself
 *
 * @example
 * const gallactic = new Gallactic(conn);
 * gallactic.getChainId().then(chId => contains chain information );
 */
class Gallactic {
  /**
   * Set up connection used to interact with the node
   * @param {Object} conn Connection instance object. Available under igc.conn
   */
  constructor(conn) {
    this.conn = conn;
  }

  /**
   * Get ChainId info
   * @returns {Object} Promise contains ChainId info
   */
  getChainId() {
    let req = {
      bcMethod: bcMtd.getChainId,
      params: {}
    };
    return this.conn.send(req);
  }

  /**
   * Get Bc node info
   * @returns {Object} Promise contains the node info e.g. latest block, version and etc
   */
  getInfo() {
    console.warn('"getInfo" method is going to be deprecated! use "getStatus" method instead');
    let req = {
      bcMethod: bcMtd.getStatus,
      params: {}
    };
    return this.conn.send(req);
  }

  /**
   * Get latest block info
   * @returns {Object} Promise contains latest block info e.g. height, hash, etc
   */
  getLatestBlock() {
    let req = {
      bcMethod: bcMtd.getLatestBlock,
      params: {}
    };
    return this.conn.send(req)
  }

  /**
   * Get a block information based on given block height
   * @param {Number} height Block height
   * @returns {Object} Promise contains block information
   */
  getBlock(height) {
    let req = {
      bcMethod: bcMtd.getBlock,
      params: { height }
    };
    return this.conn.send(req)
  }

  /**
   * Get transactions information given block height
   * @param {Number} height block height
   * @returns {Object} Promise contains block information
   */
  getBlockTxns(height) {
    let req = {
      bcMethod: bcMtd.getBlockTxns,
      params: { height }
    };
    return this.conn.send(req)
  }

  /**
   * Get consensus state information
   * @returns {Object} Promise contains consensus state information
   */
  getConsensusState() {
    let req = {
      bcMethod: bcMtd.getConsensusState,
      params: {}
    };
    return this.conn.send(req)
  }

  /**
   * Get genesis json information
   * @returns {Object} Promise contains genesis json information
   */
  getGenesis() {
    let req = {
      bcMethod: bcMtd.getGenesis,
      params: {}
    };
    return this.conn.send(req)
  }

  /**
   * Get node's peers information
   * @returns {Object} Promise contains node's peers information
   */
  getPeers() {
    let req = {
      bcMethod: bcMtd.getPeers,
      params: {}
    };
    return this.conn.send(req)
  }

  /**
   * Get Bc node status along with some information
   * @returns {Object} Promise contains the node info e.g. latest block, version and etc
   */
  getStatus() {
    let req = {
      bcMethod: bcMtd.getStatus,
      params: {}
    };
    return this.conn.send(req);
  }

  /**
   * Get node status along with some information
   * @returns {Object} Promise contains the node info e.g. latest block, version and etc
   */
  getUnconfirmedTxs() {
    let req = {
      bcMethod: bcMtd.getUnconfirmedTxs,
      params: {}
    };
    return this.conn.send(req);
  }
}

module.exports = Gallactic