'use strict';

const config = require('../config/constant'),
  conversion = require('../utils/conversion'),
  gkeys = require('gallactickeys'),
  txnMtd = config.gallactic.transaction.method,
  SEND_TXN_ID = config.transactionType.sendId,
  CALL_TXN_ID = config.transactionType.callId,
  PERM_TXN_ID = config.transactionType.permId,
  BOND_TXN_ID = config.transactionType.bondId,
  UBND_TXN_ID = config.transactionType.ubndId,
  SEND_TXN_TYPE = config.transactionType.send,
  CALL_TXN_TYPE = config.transactionType.call,
  PERM_TXN_TYPE = config.transactionType.perm,
  BOND_TXN_TYPE = config.transactionType.bond,
  UBND_TXN_TYPE = config.transactionType.ubnd;

/**
 * A module of constructing transaction object also provide a way
 * to send, call, bond, unbound transaction to the blockchain node
 *
 * @example
 * const privKey = '<insert_private_key>'
 * const igc = new Intergallactic({ url: 'localhost:1337/rpc', protocol: 'jsonrpc' });
 * const newTxn = new igc.Transaction({
 *   to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj'
 *   amount: 100
 * });
 * newTxn.send(privKey)
 *  .then(res => res contains transaction info)
 */
class Transaction {
  constructor (igc, data = {}) {
    if (!data.to || typeof data.amount === 'undefined') {
      throw new Error('Invalid or empty "to" and "amount" field. Please provide valid "to" and "amount" field')
    }
    this.igc = igc;
    this.conn = this.igc.conn;
    this._to = data.to;
    this._amount = data.amount;
    this._unit = this._unit || config.gallactic.transaction.defaultUnit;

    // general optional fields
    if (data.type) this._typeId = data.type;
    if (data.unit) this._unit = data.unit;
    if (data.chainId) this._chainId = data.chainId;
    if (data.sequence) this._sequence = data.sequence;

    // assigning public var
    if (this._typeId) this._type = this._getTxnType();

    // special field for call
    if (data.gasLimit) this._gasLimit = data.gasLimit;
    if (data.data) this._data = data.data;

    // special field for bond
    if (data.publicKey) this._publicKey = data.publicKey;

    // special field for permission
    if (data.permissions) this._permissions = data.permissions;
    if (data.set) this._set = data.set;

    if (this._chainId && this._sequence) {
      // TODO: add synchronous sign flag here?
    }
  }

  sign (privKey) {
    // condition if type is not exist
    if (this._typeId) this.type = this._getTxnType();
    if (!privKey) {
      throw new Error('Signing transaction require "private key" value. Please assign private key upon signing');
    }
    if (!this._type) {
      throw new Error('Signing transaction require transaction "type" field. Please use declare instance with "type" field and try again');
    }
    this._setFrom(privKey);
    return this._setChainId() // get chain id
      .then(() => { return this._setSequence() }) // get sequence
      .then(() => { return this._buildTxnByType() }) // build txn
      .then(() => { return this._setSignatories(privKey) }) // sign
      .then(() => { this._signatories.map(e => e.signature); });
  }
  signSync (privKey) {
    if (!privKey) {
      throw new Error('Signing transaction require "privateKey" value. Please assign private key upon signing');
    }
    if (!this._chainId || (typeof this._sequence !== 'number' && !Array.isArray(this._sequence))) {
      throw new Error('Signing synchronously require valid "chainId" and "sequence" value.')
    }
    this._setFrom(privKey);
    // build txn
    this._buildTxnByType();
    // sign
    this._setSignatories(privKey);
  }
  broadcast () {
    let req = {
      bcMethod: txnMtd.broadcastTxn,
      params: {
        chainId: this._chainId,
        type: this._type,
        tx: this.txn,
        signatories: this._signatories
      }
    };

    return this.conn.send(req);
  }
  /**
   * To broadcast "SEND transaction" to the blockchain node
   * @param {String|Array} Private key string a String Array of Private Key
   * @returns {Object} a Promise that contains the transaction info
   */
  send (privKey) {
    // set transaction type to SendTx disregarding previous value
    this._type = SEND_TXN_TYPE;
    return this.sign(privKey)
      .then(() => { return this.broadcast() });
  }
  /**
   * To broadcast "CALL transaction" to the blockchain node
   * @param {String} Private key string a String Array of Private Key
   * @returns {Object} a Promise that contains the transaction info
   */
  call (privKey) {
    if (!this._gasLimit) throw new Error('Using call transaction require "gasLimit" field upon instantiating new transaction');
    if (!this._data) throw new Error('Using call transaction require "data" field upon instantiating new transaction');
    // set transaction type to SendTx disregarding previous value
    this._type = CALL_TXN_TYPE;
    return this.sign(privKey)
      .then(() => { return this.broadcast() });
  }
  /**
   * To broadcast "BOND transaction" to the blockchain node
   * @param {String} Private key string a String Array of Private Key
   * @returns {Object} a Promise that contains the transaction info
   */
  bond (privKey) {
    if (!this._publicKey) throw new Error('Using bond transaction require "publicKey" field upon instantiating new transaction')
    // set transaction type to SendTx disregarding previous value
    this._type = BOND_TXN_TYPE;
    return this.sign(privKey)
      .then(() => { return this.broadcast() });
  }
  /**
   * To broadcast "UNBOND transaction" to the blockchain node
   * @param {String} Private key string a String Array of Private Key
   * @returns {Object} a Promise that contains the transaction info
   */
  unbond (privKey) {
    // set transaction type to SendTx disregarding previous value
    this._type = UBND_TXN_TYPE;
    return this.sign(privKey)
      .then(() => { return this.broadcast() });
  }
  /**
   * To broadcast "PERMISSION transaction" to the blockchain node
   * @param {String} Private key string a String Array of Private Key
   * @returns {Object} a Promise that contains the transaction info
   */
  permission (privKey) {
    // set transaction type to SendTx disregarding previous value
    this._type = PERM_TXN_TYPE;
    return this.sign(privKey)
      .then(() => { return this.broadcast() });
  }


  /**
   * =======================
   * PRIVATE METHODS Section
   * =======================
   */
  /**
   * Helper function to set transaction type based on given type number
   * @param {Number} txnType A transaction type number (1 - SEND_TXN, 2 - CALL_TXN)
   * @returns {String} A string of transaction type signature
   */
  _getTxnType () {
    if (this._typeId === SEND_TXN_ID) return SEND_TXN_TYPE;
    else if (this._typeId === CALL_TXN_ID) return CALL_TXN_TYPE;
    else if (this._typeId === BOND_TXN_ID) return BOND_TXN_TYPE;
    else if (this._typeId === UBND_TXN_ID) return UBND_TXN_TYPE;
    else if (this._typeId === PERM_TXN_ID) return PERM_TXN_TYPE;
    else throw new Error('Unable to get Transaction sign of transaction type ' + this._typeId);
  }

  /**
   * Helper function to set from to `this` object
   * @param  {String}  privKey  [Base 58 encoded string of Private key]
   */
  _setFrom (privKey) {
    if (Array.isArray(privKey)) {
      this._from = privKey.map(e => this._getAddress(e, this.type))
    } else {
      this._from = this._getAddress(privKey, this.type);
    }
  }

  /**
   * Helper function to get address based on given private key
   * @param   {String}  privKey  [private key string]
   * @return  {String}  [a base 58 encoded address string]
   */
  _getAddress (privKey) {
    return this._type === UBND_TXN_TYPE
      ? gkeys.utils.crypto.getVaAddrByPrivKey(privKey)
      : gkeys.utils.crypto.getAcAddrByPrivKey(privKey);
  }

  /**
   * Helper function to set chainId to `this` object
   */
  _setChainId () {
    return this._getChainId()
      .then(chainId => this._chainId = chainId);
  }

  /**
   * Helper function to get chain id of the node
   * @return  {String}  [Chain Id string of the node]
   */
  _getChainId () {
    let chainId;
    return this.igc.gallactic.getChainId()
      .then(res => {
        if (res && res.body && res.body.result) {
          chainId = res.body.result.ChainId;
        }
        if (!chainId) {
          throw new Error('Unable to retrieve Chain Id, please try again later');
        }
        return chainId
      });
  }

  /**
   * Helper function to set sequence to `this` object
   */
  _setSequence () {
    let seqPromise;
    if (Array.isArray(this._from)) {
      seqPromise = Promise.all(this._from.map(e => this._getSequence(e)))
    } else {
      seqPromise = this._getSequence(this._from);
    }
    return seqPromise
      .then(seq => this._sequence = seq)
  }

  /**
   * Helper function to retrieve sequence number of an account
   * @param   {String}  from  [base 58 encoded address string]
   * @return  {Number}  [the transaction sequence of an account]
   */
  _getSequence (from) {
    let sequence;
    const getAccount = () => {
      return gkeys.utils.crypto.isVaAddress(from)
        ? this.igc.account.getValidator(from)
        : this.igc.account.getAccount(from);
    }

    return getAccount()
      .then(res => {
        if (res && res.body && res.body.result) {
          sequence = (res.body.result.Account || res.body.result.Validator).sequence;
        }
        if (typeof sequence !== 'number') {
          throw new Error('Unable to retrieve sequence, please try again later');
        }

        // increment by 1 for next transaction
        sequence += 1;
        return sequence;
      });
  }

  /**
   * Helper function to set signatories to `this` object
   * @param  {String}  privKey  [base 58 encoded string of private key]
   */
  _setSignatories(privKey) {
    let signatories = []
    if (Array.isArray(privKey)) {
      signatories = privKey.map(e => {
        return this._getSignatories(e)
      });
    } else {
      signatories.push(this._getSignatories(privKey))
    }
    this._signatories = signatories;
  }

  /**
   * helper function to sign a transaction using private key and return the signatory object
   * @param {String} privKey private key string
   * @returns {Object} A signatory object that contains the signature and public key
   */
  _getSignatories (privKey) {
    const signObj = JSON.stringify({
      chainId: this._chainId,
      type: this._type,
      tx: this.txn
    });

    const signature = gkeys.utils.util.bytesToHexUpperString(
      gkeys.utils.crypto.sign(
        // message need to be keccak hashed before converted to buffer
        gkeys.utils.util.strToBuffer(gkeys.utils.crypto.sha3(signObj)), // message
        // base 58 decode the private key and convert it to buffer
        gkeys.utils.util.strToBuffer(gkeys.utils.crypto.bs58Decode(privKey), 'hex') // pvK buffer
      )
    );
    return { signature, publicKey: gkeys.utils.crypto.getPubKeyByPrivKey(privKey) }
  }

  /**
   * helper function to set txn to `this` object
   */
  _buildTxnByType () {
    this.txn = {};
    const from = this._from,
      to = this._to,
      sequence = this._sequence,
      amountFrom = this._amount,
      amountTo = this._amount,
      unit = this._unit;

    if (this._type === SEND_TXN_TYPE) {
      this.txn = {
        senders: Array.isArray(from)
          ? from.map((e, i) => buildTxnFrom(e, sequence[i]))
          : [buildTxnFrom(from, sequence)],
        receivers: Array.isArray(to) ? to.map(e => buildTxnTo(e)) : [buildTxnTo(to)]
      };
    }
    else if (this._type === CALL_TXN_TYPE) {
      this.txn = {
        caller: buildTxnFrom(from, sequence),
        callee: buildTxnTo(to),
        gasLimit: this._gasLimit,
        data: this._rawData
      };
    }
    else if (this._type === PERM_TXN_TYPE) {
      this.txn = {
        modifier: buildTxnFrom(from, sequence),
        modified: buildTxnTo(to),
        permissions: this._permissions,
        set: this._set
      };
    }
    else if (this._type === BOND_TXN_TYPE) {
      this.txn = {
        from: buildTxnFrom(from, sequence),
        to: buildTxnTo(to),
        public_key: this._publicKey
      }
    }
    else if (this._type === UBND_TXN_TYPE) {
      this.txn = {
        from: buildTxnFrom(from, sequence),
        to: buildTxnTo(to)
      }
    }
    else {
      throw new Error('Cant build transaction object based on this type: ' + this._type);
    }

    function buildTxnFrom (from, seq) {
      if (!from && gkeys.utils.crypto.isAddress(from)) {
        throw new Error('Cant build transaction. "from" contains invalid address');
      }
      if (typeof seq !== 'number') {
        throw new Error('Cant build transaction. "sequence" contains invalid value')
      }
      if (typeof amountFrom !== 'number') {
        throw new Error('Cant build transaction. "amount" contains invalid value')
      }

      const newFrom = {
        address: from,
        amount: conversion.toBoson(amountFrom, unit).toNumber(),
        sequence: seq
      }
      return newFrom;
    }

    function buildTxnTo (to) {
      if (!to && gkeys.utils.crypto.isAddress(to)) {
        throw new Error('Cant build transaction. to.amount contains invalid value')
      }
      if (typeof amountTo !== 'number') {
        throw new Error('Cant build transaction. from.amount contains invalid value')
      }
      const newTo = {
        address: to,
        amount: conversion.toBoson(amountTo, unit).toNumber()
      };
      return newTo;
    }
  }
}

module.exports = Transaction;