'use strict'

const config = require('../config/constant'),
  accountMtd = config.burrow.account.method;

class Account {
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
      burrowMethod: accountMtd.getAccounts,
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
      burrowMethod: accountMtd.getAccount,
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
      burrowMethod: accountMtd.getStorage,
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
      burrowMethod: accountMtd.getStorageAt,
      params: {
        address, key
      }
    };
    return this.conn.send(req);
  }
}

module.exports = Account;