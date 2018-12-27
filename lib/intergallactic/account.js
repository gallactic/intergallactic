'use strict'

const config = require('../config/constant'),
  accountMtd = config.gallactic.account.method;

/**
 * Interact with Gallactic node to get the info like account info
 *
 * @example
 * const account = new Account(conn);
 * account.getAccount().then(acc => contains acc information );
 */
class Account {
  /**
   * Set up connection used to interact with the node
   * @param {Object} conn Connection instance object. Available under igc.conn
   */
  constructor(conn) {
    this.conn = conn;
  }

  /**
   * Get list of account details
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   * @returns {Object} [A list of account]
   */
  listAccounts() {
    let req = {
      bcMethod: accountMtd.getAccounts,
      params: {}
    };
    return this.conn.send(req)
  }
  /**
   * Get Account details by address
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   * @returns {Object} [An object contains the account details of an address]
   */
  getAccount(address) {
    let req = {
      bcMethod: accountMtd.getAccount,
      params: {
        address: address
      }
    };
    return this.conn.send(req)
  }
  /**
   * To get storage info
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   */
  getStorage(address) {
    let req = {
      bcMethod: accountMtd.getStorage,
      params: {
        address
      }
    };
    return this.conn.send(req);
  }
  /**
   * To get storage info
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   * @param {String} key []
   */
  getStorageAt(address, key) {
    let req = {
      bcMethod: accountMtd.getStorageAt,
      params: {
        address, key
      }
    };
    return this.conn.send(req);
  }
  /**
   * To get a specific validator account information
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   * @returns {Object} [An object contains the account details of an address]
   */
  getValidator(address) {
    let req = {
      bcMethod: accountMtd.getValidator,
      params: {
        address: address
      }
    };
    return this.conn.send(req)
  }
  /**
   * To get list of validator account information
   * @param {String} address [A hex string 20 characters long or 40 bytes]
   * @returns {Object} [An object contains the account details of an address]
   */
  listValidators(address) {
    let req = {
      bcMethod: accountMtd.getValidators,
      params: {}
    };
    return this.conn.send(req)
  }
}

module.exports = Account;