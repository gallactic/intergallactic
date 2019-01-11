'use strict';

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

const BOND_TX_TYPE = config.transactionType.bond;

class BondTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  bond(publicKey, amount, privKey) {
    const fromAccount = gkeys.getAccountByPrivkey(privKey);
    const from = fromAccount.acAddress;
    const  toAccount = gkeys.getAccountByPubkey(publicKey);
    const to = toAccount.vaAddress;

    return this._getChainId().then(chainId => {
      return this._getSequence(from).then(sequence => {
        let txn = this.buildTxn(from, to, publicKey, amount, sequence);
        const signatories = this._setSignatories(
          chainId,
          BOND_TX_TYPE,
          txn,
          privKey
        );
        return this.broadcast(chainId, BOND_TX_TYPE, txn, signatories);
      });
    });
  }

  buildTxn(from, to, publicKey, amountFrom, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const bondTxn = {
      from: {
        address: from,
        amount: amount,
        sequence: sequence
      },
      to: {
        address: to,
        amount: amount
      },
      public_key: publicKey
    };
    return bondTxn;
  }
}
module.exports = BondTx;