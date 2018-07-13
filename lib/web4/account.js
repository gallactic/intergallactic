'use strict'

const config = require('../config/constant'),
  accountMtd = config.burrow.account.method;

class Account {
  constructor(web4) {
    this.web4 = web4;
    this.conn = this.web4.conn;
  }

  /**
   * Get details of accounts list
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
  getAccount(address) {
    let req = {
      burrowMethod: accountMtd.getAccount,
      params: {
        address: address
      }
    };
    return this.conn.send(req)
  }
  getStorage(address) {
    let req = {
      burrowMethod: accountMtd.getStorage,
      params: {
        address
      }
    };
    return this.conn.send(req);
  }
  getStorageAt(address, key) {
    let req = {
      burrowMethod: accountMtd.getStorageAt,
      params: {
        address, key
      }
    };
    return this.conn.send(req);
  }
  // getBalance(address, cb) {

  // }
  // getSequence(address, cb) {

  // }
}

module.exports = Account;