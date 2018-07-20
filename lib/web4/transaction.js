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
    this.util = this.Web4.util;
  }

  sign(privKey) {
    const address = gkeys.utils.crypto.getAddressByPrivKey(privKey);
    const getChainAndAcc = Promise.all([
      this.Web4.gltc.getChainId(),
      this.Web4.account.getAccount(address)
    ]);
    const getChainAndAccHandler = res => {
      // res contains 2 promise (chainInfo and account details)
      let chainRes = res[0], accRes = res[1], sequence, chainId;

      if (chainRes && chainRes.body && chainRes.body.result) {
        chainId = chainRes.body.result.ChainId;
      }
      if (accRes && accRes.body && accRes.body.result && accRes.body.result.Account) {
        sequence = accRes.body.result.Account.Sequence
      }
      if (!chainId) {
        throw new Error('Unable to retrieve Chain Id, please try again later');
      }
      if (!sequence) {
        throw new Error('Unable to retrieve sequence, please try again later');
      }
      // modify txn object
      if (this.txnType === 1) {
        this.txn.inputs.forEach(e => {
          sequence = sequence + 1;
          e.sequence = sequence;
        });
      }
      else if (this.txnType === 2) {
        sequence = sequence + 1;
        this.txn.input.sequence = sequence;
      }
      return chainId;
    };
    const signHandler = (chainId) => {
      let signObj = JSON.stringify({
        chain_id: chainId,
        tx: [
          this.txnType === 1 ? SEND_TXN_TYPE : CALL_TXN_TYPE,
          this.txn
        ]
      });

      let data = {
        privKey: gkeys.utils.util.strToBuffer(privKey, 'hex'),
        message: gkeys.utils.util.strToBuffer(signObj)
      };

      return gkeys.utils.util.bytesToHexUpperString(
        gkeys.utils.crypto.sign(data.message, data.privKey)
      );
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

module.exports = Transaction;
