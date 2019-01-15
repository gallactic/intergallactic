'use strict';

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

const SEND_TX_TYPE = config.transactionType.send;

class SendTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  send(to, amount, privKey) {
    const account = gkeys.getAccountByPrivkey(privKey);
    const from = account.acAddress;

    return this._getChainId().then(chainId => {
      return this._getSequence(from).then(sequence => {
        let txn = this.buildTxn(from, to, amount, sequence);
        const signatories = this._setSignatories(
          chainId,
          SEND_TX_TYPE,
          txn,
          privKey
        );
        return this.broadcast(chainId, SEND_TX_TYPE, txn, signatories);
      });
    });
  }

  buildTxn(from, to, amountFrom, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const sendTxn = {
      senders: [
        {
          address: from,
          amount: amount,
          sequence: sequence
        }
      ],
      receivers: [
        {
          address: to,
          amount: amount
        }
      ]
    };
    return sendTxn;
  }
}

module.exports = SendTx;
