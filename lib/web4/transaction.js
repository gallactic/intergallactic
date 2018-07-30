'use strict'
const config = require('../config/constant'),
  gkeys = require('gallactickeys'),
  txnMtd = config.burrow.transaction.method,
  SEND_TXN_TYPE = 'SendTx',
  CALL_TXN_TYPE = 'CallTx';

/**
 * A module of constructing transaction object also provide a way
 * to send, call, bond, unbound transaction to the blockchain node
 *
 * @example
 * const privateKey = '<insert_private_key>'
 * const web4 = new Web4({ url: 'localhost:1337/rpc', protocol: 'jsonrpc' });
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
 * const newTxn = new web4.Transaction(txn, opt);
 * newTxn.signNSend(privateKey)
 *  .then(res => res contains transaction info)
 */
class Transaction {
  constructor(Web4, data = {}, opt = {}) {
    this.Web4 = Web4;
    if (!opt.type) {
      throw new Error('Instatiate transaction require type value to decide whether send or call transaction.')
    }
    this.conn = this.Web4.conn;
    this.txn = data;
    this.txnType = getTxnSign(opt.type);
    this.chainId = opt.chainId;
    this.sequence = opt.sequence;
    this.util = this.Web4.util;
  }

  /**
   * To sign transaction "synchronously" provided sequence and chainId upon instatiate
   * @param {String} privKey private key string
   * @returns {String} a transaction signature string
   */
  signSync(privKey) {
    if (!this.chainId || !this.sequence) {
      throw new Error('Chain id or sequence is not defined. Synchronous sign require chainId and sequence as parameter upon instantiate')
    }

    // Set Transaction sequence by transation type
    setTransactionSequence(this.txn, this.txnType, this.sequence);

    return signByPrivKey(privKey, this.txn, this.txnType, this.chainId);
  }

  /**
   * To sign transaction "asynchronously"
   * @param {String} privKey Private key string
   * @returns {String} a Promise that contains the transaction signature string
   */
  sign(privKey) {
    const address = gkeys.utils.crypto.getAcAddrByPrivKey(privKey);
    const getChainAndAcc = Promise.all([
      this.Web4.gltc.getChainId(),
      this.Web4.account.getAccount(address)
    ]);
    const getChainAndAccHandler = res => {
      // res contains 2 promise (chainInfo and account details)
      let chainRes = res[0], accRes = res[1];

      if (!this.chainId && chainRes && chainRes.body && chainRes.body.result) {
        this.chainId = chainRes.body.result.ChainId;
      }
      if (!this.sequence && accRes && accRes.body && accRes.body.result && accRes.body.result.Account) {
        this.sequence = accRes.body.result.Account.sequence
      }
      if (!this.chainId) {
        throw new Error('Unable to retrieve Chain Id, please try again later');
      }
      if (typeof this.sequence !== 'number') {
        throw new Error('Unable to retrieve sequence, please try again later');
      }
      setTransactionSequence(this.txn, this.txnType, this.sequence);
    };
    const signHandler = () => {
      try {
        const signature = signByPrivKey(privKey, this.txn, this.txnType, this.chainId);
        return Promise.resolve(signature);
      } catch (e) {
        throw e;
      }
    };

    return getChainAndAcc
      .then(getChainAndAccHandler)
      .then(signHandler)
      .catch(e => {
        throw e;
      });
  }

  /**
   * To broadcast "SEND transaction" to the blockchain node
   * @param {Array} signatories an array of object that contains public key and txn signature
   * @returns {Object} a Promise that contains the transaction info
   */
  send(signatories = []) {
    if (!Array.isArray(signatories) || signatories.length === 0) {
      throw new Error('signatories with valid signature and pubKey is required for sending transaction')
    }

    if (this.txnType !== SEND_TXN_TYPE) {
      throw new Error('Transaction was instantiated not for sending purpose. Unable to proceed');
    }

    let req = {
      burrowMethod: txnMtd.broadcastTxn,
      params: {
        chainId: this.chainId,
        type: this.txnType,
        tx: this.txn,
        signatories
      }
    };
    return this.conn.send(req)
  }

  /**
   * A wrapper of sign and "SEND" function
   * @param {String} privKey Private key string
   * @returns {Object} a Promise that contains the transaction info
   */
  signNSend(privKey) {
    let pubKey, signatories;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        signatories = [{ publicKey: pubKey, signature }]
        return this.send(signatories)
      });
  }

  /**
   * To broadcast "CALL transaction" to the blockchain node
   * @param {Array} signatories an array of object that contains public key and txn signature
   * @returns {Object} a Promise that contains the transaction info
   */
  call(signatories) {
    if (!Array.isArray(signatories) || signatories.length === 0) {
      throw new Error('signatories with valid signature and pubKey is required for sending transaction')
    }

    if (this.txnType !== CALL_TXN_TYPE) {
      throw new Error('Transaction was instantiated not for call purpose. Unable to proceed');
    }

    let req = {
      burrowMethod: txnMtd.broadcastTxn,
      params: {
        chainId: this.chainId,
        type: this.txnType,
        tx: this.txn,
        signatories
      }
    };
    return this.conn.send(req)
  }

  /**
   * A wrapper of sign and "CALL" function
   * @param {*} privKey Private key string
   * @returns {Object} a Promise that contains the transaction info
   */
  signNCall(privKey) {
    let pubKey, signatories;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        signatories = [{ publicKey: pubKey, signature }]
        return this.call(signatories);
      });
  }

  bond() {
    throw new Error('Pending Implementation');
  }

  unbond() {
    throw new Error('Pending Implementation')
  }
}

/**
 * PRIVATE METHODS
 */

/**
 * Helper function to set transaction sequence for send and call transaction
 * @param {Object} txn transaction object that contains necessary data
 * @param {Number} txnType transaction type identified e.g. txnType = 1
 * @param {Number} sequence a sequence number
 * @returns {undefined} no return value as this is just a helper to set txn sequence
 */
function setTransactionSequence (txn, txnType, sequence) {
  // Set Transaction sequence by transation type
  if (txnType === SEND_TXN_TYPE) {
    if (!txn.senders) {
      throw new Error('Transaction inputs required for transaction type ' + txnType)
    }
    // TODO: have a helper function to set the sequence of the input
    // TODO: Check input amount must be more than OR equal output amount
    txn.senders.forEach(e => {
      sequence = sequence + 1;
      e.sequence = sequence;
    });
  }
  else if (txnType === CALL_TXN_TYPE) {
    sequence = sequence + 1;
    txn.caller.sequence = sequence;
  }
  else {
    throw new Error(`Setting sequence with transaction type ${this.txnType} is not supported yet!`)
  }
}

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

/**
 * Helper function to set transaction type based on given type number
 * @param {Number} txnType A transaction type number (1 - SEND_TXN, 2 - CALL_TXN)
 * @returns {String} A string of transaction type signature
 */
function getTxnSign (txnType) {
  if (txnType === 1) return SEND_TXN_TYPE;
  else if (txnType === 2) return CALL_TXN_TYPE;
  else throw new Error('Unable to get Transaction sign of transaction type ' + txnType);
}

module.exports = Transaction;
