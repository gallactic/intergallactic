'use strict'
const config = require('../config/constant'),
  gkeys = require('gallactickeys'),
  txnMtd = config.burrow.transaction.method,
  SEND_TXN_TYPE = 'SendTx',
  CALL_TXN_TYPE = 'CallTx';

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

  signSync(privKey) {
    if (!this.chainId || !this.sequence) {
      throw new Error('Chain id or sequence is not defined. Synchronous sign require chainId and sequence as parameter upon instantiate')
    }

    // Set Transaction sequence by transation type
    setTransactionSequence(this.txn, this.txnType, this.sequence);

    return signByPrivKey(privKey, this.txn, this.txnType, this.chainId);
  }

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

  signNSend(privKey) {
    let pubKey, signatories;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        signatories = [{ publicKey: pubKey, signature }]
        return this.send(signatories)
      });
  }

  call(signature, pubKey) {
    if (!signature && pubKey) {
      throw new Error('signature and pubKey is required for sending transaction')
    }

    if (this.txnType !== 2) {
      throw new Error('Transaction was instantiated not for call purpose. Unable to proceed');
    }
    this.txn.input.signature = [CALL_TXN_TYPE, signature];
    this.txn.input.public_key = [CALL_TXN_TYPE, pubKey];

    let req = {
      burrowMethod: txnMtd.broadcastTxn,
      params: [
        SEND_TXN_TYPE, this.txn
      ]
    };
    return this.conn.send(req)
  }

  signNCall(privKey) {
    let pubKey;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        return this.call(signature, pubKey)
      });
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
    txn.senders.forEach(e => {
      sequence = sequence + 1;
      e.sequence = sequence;
    });
  }
  else if (txnType === CALL_TXN_TYPE) {
    sequence = sequence + 1;
    txn.sender.sequence = sequence;
  }
  else {
    throw new Error(`Setting sequence with transaction type ${this.txnType} is not supported yet!`)
  }
}

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

function getTxnSign (txnType) {
  if (txnType === 1) return SEND_TXN_TYPE;
  else if (txnType === 2) return CALL_TXN_TYPE;
  else throw new Error('Unable to get Transaction sign of transaction type ' + txnType);
}

module.exports = Transaction;
