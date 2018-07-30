'use strict'

const Account = require('./web4/account'),
  BigNumber = require('./libs/bignumber'),
  Connection = require('./libs/connection'),
  Gallactic = require('./web4/gallactic'),
  Transaction = require('./web4/transaction'),
  pckg = require('../package');

/**
 * This is a Web4 Class that can be instantiated to give
 * list of useful features to interact with blockchain node.
 * @example
 * const web4 = new Web4({ url: 'localhost:1337/rpc', protocol: 'jsonrpc' });
 * web4.account.getAccount(<address_value>)
 *  .then(acc => console.log(acc));
 */
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
  const conversion = require('./utils/conversion'),
    util = require('./utils/common'),
    GallacticKeys = require('gallactickeys');

  return {
    conversion,
    util,
    gkUtil: GallacticKeys.utils
  }
}

/**
 * Helper function to get the package version and etc
 * @returns {Object} Versions of web4 and etc
 */
function getVersion() {
  return {
    web4: require('../package.json').version
  }
}

module.exports = Web4;