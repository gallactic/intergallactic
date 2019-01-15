"use strict";

const config = require("../../config/constant"),
  gkeys = require("gallactickeys");

class Transaction {
  constructor(igc) {
    this.igc = igc;
    this.conn = this.igc.conn;
    this.txnUnit = config.gallactic.transaction.defaultUnit;
  }

  signTransaction(privateKey, txnObject) {
    if (!privateKey) {
      throw new Error(
        'Signing transaction require "privateKey" value. Please assign private key upon signing'
      );
    }
    let data = {
      privateKey: gkeys.utils.util.strToBuffer(
        gkeys.utils.crypto.bs58Decode(privateKey),
        "hex"
      ),
      message: gkeys.utils.util.strToBuffer(gkeys.utils.crypto.sha3(txnObject)) // message need to be keccak hashed before converted to buffer
    };

    return gkeys.utils.util.bytesToHexUpperString(
      gkeys.utils.crypto.sign(data.message, data.privateKey)
    );
  }

  broadcast(chainId, type, txnObj, signatories) {
    let req = {
      bcMethod: config.gallactic.transaction.method.broadcastTxn,
      params: {
        chainId: chainId,
        type: type,
        tx: txnObj,
        signatories: signatories
      }
    };
    return this.conn.send(req);
  }

  _getChainId() {
    let chainId;
    return this.igc.gallactic.getChainId().then(res => {
      if (res && res.body && res.body.result) {
        chainId = res.body.result.ChainId;
      }
      if (!chainId) {
        throw new Error("Unable to retrieve Chain Id, please try again later");
      }
      return chainId;
    });
  }

  _getSequence(from) {
    let sequence;
    const getAccount = () => {
      return gkeys.utils.crypto.isVaAddress(from)
        ? this.igc.account.getValidator(from)
        : this.igc.account.getAccount(from);
    };

    return getAccount().then(res => {
      if (res && res.body && res.body.result) {
        sequence = (res.body.result.Account || res.body.result.Validator)
          .sequence;
      }
      if (typeof sequence !== "number") {
        throw new Error("Unable to retrieve sequence, please try again later");
      }
      sequence += 1;
      return sequence;
    });
  }

  _setSignatories(chainId, type, txnObj, privKey) {
    let signatories = [];
    const txn = JSON.stringify({
      chainId: chainId,
      type: type,
      tx: txnObj
    });

    if (Array.isArray(privKey)) {
      signatories = privKey.map(e => {
        return this._getSignatories(e, txn);
      });
    } else {
      signatories.push(this._getSignatories(privKey, txn));
    }
    return signatories;
  }

  _getSignatories(privKey, txn) {
    const signature = this.signTransaction(privKey, txn);
    return {
      signature,
      publicKey: gkeys.utils.crypto.getPubKeyByPrivKey(privKey)
    };
  }
}

module.exports = Transaction;
