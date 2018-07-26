'use strict'

const Account = require('./web4/account'),
  Connection = require('./libs/connection'),
  Gallactic = require('./web4/gallactic'),
  Transaction = require('./web4/transaction'),
  pckg = require('../package');

class Web4 {
  constructor(option = {}) {
    this.setConnection(option.url || option.uri, option.protocol);
    this.account = new Account(this.conn);
    this.gltc = new Gallactic(this.conn);
    this.Txn = Transaction.bind(null, this);
    this.utils = getUtil();
    this.version = getVersion();
  }

  /**
   * Setting up the provider for interacting with the blockchain node
   * @param {String} url [contains url string value]
   * @param {String} protocol [contains protocol string value. e.g. jsonrpc | grpc]
   * @returns {Object} [Connection object]
   */
  setConnection (url, protocol) {
    if (!url || !protocol) {
      throw new Error('uri & protocol must be provided in order for the library to interact with the blockchain node');
    }

    this.conn = new Connection(url, protocol);
    return this.conn;
  }
}


/**
 * PRIVATE METHODS
 */
/**
 * Helper function to retrieve all utils function
 * @returns {Object} the utitilis function
 */
function getUtil() {
  const util = require('./utils/common');
  return {
    util
  }
}

function getVersion() {
  return {
    web4: require('../package.json').version
  }
}

module.exports = Web4;