'use strict'

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

  const UNBOND_TX_TYPE = config.transactionType.ubnd;;

  class UnBondTx extends Transaction {
      constructor(igc) {
          super(igc)
      }

      unbond(to, amount, privKey) {
        const account = gkeys.getAccountByPrivkey(privKey);
        const from = account.vaAddress;

        return this._getChainId().then(chainId => {
            return this._getSequence(from).then(sequence => {
              let txn = this.buildTxn(from, to, amount, sequence);
              const signatories = this._setSignatories(
                chainId,
                UNBOND_TX_TYPE,
                txn,
                privKey
              );
              return this.broadcast(chainId, UNBOND_TX_TYPE, txn, signatories);
            });
          });
      }

      buildTxn(from, to, amountFrom, sequence) {
        const amount = conversion.toBoson(amountFrom, this.txnUnit).toNumber();
        const unbondTxn = {
            from: {
              address: from,
              amount: amount,
              sequence: sequence
            },
            to: {
              address: to,
              amount: amount
            }
          };
        return unbondTxn;
      }
  }
module.exports = UnBondTx;