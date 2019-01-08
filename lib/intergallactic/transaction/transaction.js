'use strict'

const config = require('../../config/constant'),
       gkeys = require('gallactickeys');

class Transaction {
  constructor(igc) {
    this.igc = igc;
    this.conn = this.igc.conn;
    this.utils = this.igc.utils;
    this.txnUnit = config.gallactic.transaction.defaultUnit;
  }

  broadcast(privKey) {
    let pubKey, signatories;
    // get the tm pub key
    pubKey = gkeys.utils.crypto.getTmPubKeyByPrivKey(privKey);
    // base58 encode the pubkey
    pubKey = gkeys.utils.crypto.bs58Encode(pubKey, 4) // TODO: replace 4 with gkeys.constant._PUB_KEY_ID

    if (!this.chainId || typeof this.sequence !== 'number') {
      throw new Error('Chain id or sequence is not defined. Unable to proceed');
    }
    if (!this.signatories || this.signatories.length === 0) {
      throw new Error('Signatories is empty! Unable to proceed.');
    }

    setTxnSequence(this.txn, this.txnType, this.sequence);

    return this.signByPrivKey(privKey,this.txn,this.txnType,this.chainId)
      .then(signature => {
        signatories = [{ publicKey: pubKey, signature }]

        validateSignatories(signatories);

        this.signatories = signatories;

        //Broadcasting ...
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
      });
  }

  setSeq(seq){
    this.sequence=seq;
  }

  setChainID(chainID){
    this.chainId=chainID;
  }

  setUnit(unit){
    this.txnUnit=unit;
  }

  _setTxn(_txnType,_txn){
    this.txnType=_txnType;
    this.txn=_txn;
  }

  _setTxnFrom (from = {}, unit = option.unit) {
    if (!from.address) {
      throw new Error('Cant build transaction. from.address contains invalid address');
    }
    if (typeof from.amount === 'undefined' || typeof from.amount === 'null') {
      throw new Error('Cant build transaction. from.amount contains invalid value')
    }

    const newFrom = {
      address: from.address,
      amount: conversion.toBoson(from.amount, unit).toNumber()
    }
    return newFrom;
  }

  _setTxnTo (to = {}, unit = option.unit) {
    if (typeof to.amount === 'undefined' || typeof to.amount === 'null') {
      throw new Error('Cant build transaction. to.amount contains invalid value')
    }
    const newTo = {
      address: to.address,
      amount: conversion.toBoson(to.amount, unit).toNumber()
    };
    return newTo;
  }

  _signByPrivKey (privKey, txn, txnType, chainId) {
    let signObj;
    signObj = JSON.stringify({
      chainId: chainId,
      type: txnType,
      tx: txn
    });

    let data = {
      // base 58 decode the private key and convert it to buffer
      privKey: gkeys.utils.util.strToBuffer(
        gkeys.utils.crypto.bs58Decode(privKey), 'hex'
      ),
      // message need to be keccak hashed before converted to buffer
      message: gkeys.utils.util.strToBuffer(gkeys.utils.crypto.sha3(signObj))
    };

    return gkeys.utils.util.bytesToHexUpperString(
      gkeys.utils.crypto.sign(data.message, data.privKey)
    );
  }

  _setTxnSequence (txn, txnType, sequence) {
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

  _validateSignatories (signatories) {
    if (!Array.isArray(signatories) || signatories.length === 0) {
      throw new Error('signatories with valid signature and pubKey is required for sending transaction')
    }
  }
}

module.exports = Transaction;