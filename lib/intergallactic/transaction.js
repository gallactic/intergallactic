'use strict'
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
 * const txn = {
 *   senders: [{
 *   address: testAcc.address,
 *     amount: 10
 *   }],
 *   receivers: [{
 *     address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
 *     amount: 10
 *   }]
 * };
 * const opt = { txnType: 1 // required }
 * const newTxn = new igc.Transaction(txn, opt);
 * newTxn.signNBroadcast(privKey)
 *  .then(res => res contains transaction info)
 */
class Transaction {
  constructor(igc, data = {}, opt = {}) {
    this.igc = igc;
    if (!opt.type) {
      throw new Error('Instatiate transaction require type value to decide whether send or call transaction.')
    }
    this.conn = this.igc.conn;
    this.utils = this.igc.utils;
    this.txn = data;
    this.txnType = getTxnSign(opt.type);
    this.chainId = opt.chainId;
    this.sequence = opt.sequence;
  }

  /**
   * To sign transaction "synchronously" provided sequence and chainId upon instatiate
   * @param {String} privKey private key string
   * @returns {String} a transaction signature string
   */
  signSync(privKey) {
    if (!this.chainId || typeof this.sequence !== 'number') {
      throw new Error('Chain id or sequence is not defined. Synchronous sign require chainId and sequence as parameter upon instantiate')
    }

    this.txn = buildTxnByType(this.txn, this.txnType);
    // Set Transaction sequence by transation type
    setTxnSequence(this.txn, this.txnType, this.sequence);

    return signByPrivKey(privKey, this.txn, this.txnType, this.chainId);
  }

  /**
   * To sign transaction "asynchronously"
   * @param {String} privKey Private key string
   * @returns {String} a Promise that contains the transaction signature string
   */
  sign(privKey) {
    const address = gkeys.utils.crypto.getAcAddrByPrivKey(privKey);
    const getChainIdNSequence = () => {
      return Promise.all([
        this.igc.gltc.getChainId(),
        this.igc.account.getAccount(address)
      ]);
    }
    const buildTxn = res => {
      // res contains 2 promise (chainInfo and account details)
      let chainRes = res[0], accRes = res[1];

      if (!this.chainId && chainRes && chainRes.body && chainRes.body.result) {
        this.chainId = chainRes.body.result.ChainId;
      }
      if (!this.sequence && accRes && accRes.body && accRes.body.result && accRes.body.result.Account) {
        this.sequence = accRes.body.result.Account.sequence;
      }
      if (!this.chainId) {
        throw new Error('Unable to retrieve Chain Id, please try again later');
      }
      if (typeof this.sequence !== 'number') {
        throw new Error('Unable to retrieve sequence, please try again later');
      }

      this.txn = buildTxnByType(this.txn, this.txnType);
      setTxnSequence(this.txn, this.txnType, this.sequence);
      return;
    };
    const signTxn = () => {
      try {
        const signature = signByPrivKey(privKey, this.txn, this.txnType, this.chainId);
        return Promise.resolve(signature);
      } catch (e) {
        throw e;
      }
    };

    return getChainIdNSequence()
      .then(buildTxn)
      .then(signTxn)
      .catch(e => {
        throw e;
      });
  }

  broadcast() {
    if (!this.chainId || typeof this.sequence !== 'number') {
      throw new Error('Chain id or sequence is not defined. Unable to proceed');
    }
    if (!this.signatories || this.signatories.length === 0) {
      throw new Error('Signatories is empty! Unable to proceed.');
    }

    let req = {
      bcMethod: txnMtd.broadcastTxn,
      params: {
        chainId: this.chainId,
        type: this.txnType,
        tx: this.txn,
        signatories: this.signatories
      }
    };

    return this.conn.send(req);
  }

  /**
   * To "BROADCAST" transaction based on "TRANSACTION TYPE" to the blockchain node
   * @param {Array} signatories an array of object that contains public key and txn signature
   * @returns {Object} a Promise that contains the transaction info
   */
  signNBroadcast (privKey) {
    let pubKey, signatories;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        signatories = [{ publicKey: pubKey, signature }]

        validateSignatories(signatories);

        this.signatories = signatories;

        return this.broadcast();
      });
  }

  /**
   * To broadcast "SEND transaction" to the blockchain node
   * @param {Array} signatories an array of object that contains public key and txn signature
   * @returns {Object} a Promise that contains the transaction info
   */
  send(signatories = []) {
    validateSignatories(signatories);
    validateTxnType(this.txnType, SEND_TXN_TYPE);

    this.signatories = signatories;

    return this.broadcast();
  }

  /**
   * To broadcast "CALL transaction" to the blockchain node
   * @param {Array} signatories an array of object that contains public key and txn signature
   * @returns {Object} a Promise that contains the transaction info
   */
  call(signatories) {
    validateSignatories(signatories);
    validateTxnType(this.txnType, CALL_TXN_TYPE);

    this.signatories = signatories;

    return this.broadcast();
  }

  bond(signatories) {
    validateSignatories(signatories);
    validateTxnType(this.txnType, BOND_TXN_TYPE);

    this.signatories = signatories;

    return this.broadcast();
  }

  unbond(signatories) {
    validateSignatories(signatories);
    validateTxnType(this.txnType, UBND_TXN_TYPE);

    this.signatories = signatories;

    return this.broadcast();
  }

  permission(signatories) {
    validateSignatories(signatories);
    validateTxnType(this.txnType, PERM_TXN_TYPE);

    this.signatories = signatories;

    return this.broadcast();
  }
}

/**
 * PRIVATE METHODS
 */

/**
 * helper function to sign a transaction using private key and return a signature
 * @param {String} privKey private key string
 * @param {Object} txn Transaction object data
 * @param {String} txnType Transaction signature type (e.g. CallTx, SendTx)
 * @param {String} chainId Chain Id value
 * @returns {String} A signature of the transaction based on string format
 */
function signByPrivKey (privKey, txn, txnType, chainId) {
  let signObj;
  signObj = JSON.stringify({
    chainId: chainId,
    type: txnType,
    tx: txn
  });

  let data = {
    privKey: gkeys.utils.util.strToBuffer(privKey, 'hex'),
    message: gkeys.utils.util.strToBuffer(signObj)
  };

  return gkeys.utils.util.bytesToHexUpperString(
    gkeys.utils.crypto.sign(data.message, data.privKey)
  );
}

function buildTxnByType (tx, txnType) {
  let txn = {};
  if (txnType === SEND_TXN_TYPE) {
    txn = {
      senders: tx.from.map(e => setTxnFrom(e)),
      receivers: tx.to.map(e => setTxnTo(e))
    };
  }
  else if (txnType === CALL_TXN_TYPE) {
    txn = {
      caller: setTxnFrom(tx.from),
      callee: setTxnTo(tx.to),
      gasLimit: tx.gasLimit,
      data: tx.data
    };
  }
  else if (txnType === PERM_TXN_TYPE) {
    txn = {
      modifier: setTxnFrom(tx.from),
      modified: setTxnTo(tx.to),
      permissions: tx.permissions,
      set: tx.set
    };
  }
  else if (txnType === BOND_TXN_TYPE) {
    txn = {
      from: setTxnFrom(tx.from),
      to: setTxnTo(tx.to),
      public_key: tx.publicKey
    }
  }
  else if (txnType === UBND_TXN_TYPE) {
    txn = {
      from: setTxnFrom(tx.from),
      to: setTxnTo(tx.to)
    }
  }
  else {
    throw new Error('Cant build transaction object based on this type: ' + txnType);
  }

  return txn;

  function setTxnFrom (from = {}) {
    if (!from.address) {
      throw new Error('Cant build transaction. from.address contains invalid address');
    }
    if (typeof from.amount === 'undefined' || typeof from.amount === 'null') {
      throw new Error('Cant build transaction. from.amount contains invalid value')
    }

    const newFrom = {
      address: from.address,
      amount: conversion.toBoson(from.amount, from.unit).toNumber()
    }
    return newFrom;
  }

  function setTxnTo (to = {}) {
    if (typeof to.amount === 'undefined' || typeof to.amount === 'null') {
      throw new Error('Cant build transaction. to.amount contains invalid value')
    }
    const newTo = {
      address: to.address,
      amount: conversion.toBoson(to.amount, to.unit).toNumber()
    };
    return newTo;
  }
}

/**
 * Helper function to set transaction sequence for send and call transaction
 * @param {Object} txn transaction object that contains necessary data
 * @param {Number} txnType transaction type identified e.g. txnType = 1
 * @param {Number} sequence a sequence number
 * @returns {undefined} no return value as this is just a helper to set txn sequence
 */
function setTxnSequence (txn, txnType, sequence) {
  if (Array.isArray(txn[getTxnFromKey(txnType)]) === true) {
    txn[getTxnFromKey(txnType)].forEach(e => {
      sequence = sequence + 1;
      e.sequence = sequence;
    });
  }
  else {
    sequence = sequence + 1;
    txn[getTxnFromKey(txnType)].sequence = sequence;
  }
}

/**
 * Helper function to set transaction type based on given type number
 * @param {Number} txnType A transaction type number (1 - SEND_TXN, 2 - CALL_TXN)
 * @returns {String} A string of transaction type signature
 */
function getTxnSign (txnType) {
  if (txnType === SEND_TXN_ID) return SEND_TXN_TYPE;
  else if (txnType === CALL_TXN_ID) return CALL_TXN_TYPE;
  else if (txnType === BOND_TXN_ID) return BOND_TXN_TYPE;
  else if (txnType === UBND_TXN_ID) return UBND_TXN_TYPE;
  else if (txnType === PERM_TXN_ID) return PERM_TXN_TYPE;
  else throw new Error('Unable to get Transaction sign of transaction type ' + txnType);
}

function getTxnFromKey (txnType) {
  switch (txnType) {
    case SEND_TXN_TYPE: return config.transactionFromKey.send;
    case CALL_TXN_TYPE: return config.transactionFromKey.call;
    case BOND_TXN_TYPE: return config.transactionFromKey.bond;
    case UBND_TXN_TYPE: return config.transactionFromKey.ubnd;
    case PERM_TXN_TYPE: return config.transactionFromKey.perm;
    default: throw new Error('Unable to find from key by this type! unable to proceed');
  }
}

function validateSignatories (signatories) {
  if (!Array.isArray(signatories) || signatories.length === 0) {
    throw new Error('signatories with valid signature and pubKey is required for sending transaction')
  }
}

function validateTxnType (givenTxnType, expectedTxnType) {
  if (givenTxnType !== expectedTxnType) {
    throw new Error('Transaction was instantiated not for its purpose. Unable to proceed');
  }
}

module.exports = Transaction;
