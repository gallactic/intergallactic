'use strict'
const config = require('../config/constant'),
  gkeys = require('gallactickeys'),
  txnMtd = config.burrow.transaction.method,
  SEND_TXN_TYPE = 0x1,
  CALL_TXN_TYPE = 0x2;

class Transaction {
  constructor(Web4, data = {}, opt = {}) {
    this.Web4 = Web4;
    if (!opt.type) {
      throw new Error('Instatiate transaction require type value to decide whether send or call transaction.')
    }
    this.conn = this.Web4.conn;
    this.txn = data;
    this.txnType = opt.type;
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
    const address = gkeys.utils.crypto.getAddressByPrivKey(privKey);
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
        this.sequence = accRes.body.result.Account.Sequence
      }
      if (!this.chainId) {
        throw new Error('Unable to retrieve Chain Id, please try again later');
      }
      if (!this.sequence) {
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

  send(signature, pubKey) {
    if (!signature && pubKey) {
      throw new Error('signature and pubKey is required for sending transaction')
    }

    if (this.txnType !== 1) {
      throw new Error('Transaction was instantiated not for sending purpose. Unable to proceed');
    }
    this.txn.inputs.forEach(e => {
      e.signature = [SEND_TXN_TYPE, signature];
      e.public_key = [SEND_TXN_TYPE, pubKey];
    })
    let req = {
      burrowMethod: txnMtd.broadcastTxn,
      params: [
        SEND_TXN_TYPE, this.txn
      ]
    };
    return this.conn.send(req)
  }

  signNSend(privKey) {
    let pubKey;

    pubKey = gkeys.utils.crypto.getPubKeyByPrivKey(privKey);
    return this.sign(privKey)
      .then(signature => {
        return this.send(signature, pubKey)
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

function setTransactionSequence (txn, txnType, sequence) {
  // Set Transaction sequence by transation type
  if (txnType === 1) {
    if (!txn.inputs) {
      throw new Error('Transaction inputs required for transaction type ' + txnType)
    }
    txn.inputs.forEach(e => {
      sequence = sequence + 1;
      e.sequence = sequence;
    });
  }
  else if (txnType === 2) {
    sequence = sequence + 1;
    txn.input.sequence = sequence;
  }
  else {
    throw new Error(`Setting sequence with transaction type ${this.txnType} is not supported yet!`)
  }
}

function signByPrivKey (privKey, txn, txnType, chainId) {
  let signObj;
  signObj = JSON.stringify({
    chain_id: chainId,
    tx: [
      getTxnSign(txnType),
      txn
    ]
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
