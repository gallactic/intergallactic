'use strict'

const Account = require('./intergallactic/account'),
  BigNumber = require('./libs/bignumber'),
  config = require('./config/constant'),
  Connection = require('./libs/connection'),
  Contract = require('./intergallactic/contract'),
  Gallactic = require('./intergallactic/gallactic'),
  Transaction = require('./intergallactic/transaction'),
  pckg = require('../package');

/**
 * This is a Intergallactic Class that can be instantiated to give
 * list of useful features to interact with blockchain node.
 * @example
 * const igc = new Intergallactic({ url: 'localhost:1337/rpc', protocol: 'jsonrpc' });
 * igc.account.getAccount(<address_value>)
 *  .then(acc => acc contains account information);
 */
class Intergallactic {
  constructor(option = {}) {
    this.setConnection(option.url || option.uri, option.protocol);
    this.account = new Account(this.conn);
    this.gallactic = new Gallactic(this.conn);
    this.Transaction = Transaction.bind(null, this);
    this.Contract = Contract.bind(null, this);
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
  const abi = require('./utils/abi'),
    conversion = require('./utils/conversion'),
    util = require('./utils/common'),
    GallacticKeys = require('gallactickeys');

  return {
    abi,
    conversion,
    util,
    gkUtil: GallacticKeys.utils
  }
}

/**
 * Helper function to get the package version and etc
 * @returns {Object} Versions of igc and etc
 */
function getVersion() {
  return {
    intergallactic: require('../package.json').version
  }
}

module.exports = Intergallactic;