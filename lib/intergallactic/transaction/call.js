'use strict';

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys"),
  GOLANG_NULL  = "<nil>";


const CALL_TX_TYPE = config.transactionType.call;

class CallTx extends Transaction {
  constructor(igc) {
    super(igc);
  }

  call(toAddress, amount, data, gasLimit, privKey) {
    const fromAccount = gkeys.getAccountByPrivkey(privKey);
    const from = fromAccount.acAddress;
    
    return this._getChainId().then(chainId => {
      return this._getSequence(from).then(sequence => {
        let txn = this.buildTxn(from, toAddress, amount, data, gasLimit, sequence);
        const signatories = this._setSignatories(
          chainId,
          CALL_TX_TYPE,
          txn,
          privKey
        );
        return this.broadcast(chainId, CALL_TX_TYPE, txn, signatories);
      });
    });
  }

  buildTxn(caller, toAddress, amountFrom, data, gasLimit, sequence) {
    const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
    const bondTxn = {
      caller: {
        address: caller,
        amount: amount,
        sequence: sequence
      },
      callee: {
        address: (toAddress === GOLANG_NULL) ? null : toAddress,
        amount: amount
      },
      data: data,
      gasLimit: gasLimit
    };
    return bondTxn;
  }
}
module.exports = CallTx;