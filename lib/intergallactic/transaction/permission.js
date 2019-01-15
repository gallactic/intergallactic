'use strict'

const Transaction = require("./Transaction"),
  conversion = require("../../utils/conversion"),
  config = require("../../config/constant"),
  gkeys = require("gallactickeys");

  const PERM_TX_TYPE = config.transactionType.perm;;

  class PermissionTx extends Transaction {
      constructor(igc) {
          super(igc)
      }

      permission(address, permValue, privKey) {
        const account = gkeys.getAccountByPrivkey(privKey);
        const from = account.acAddress;

        return this._getChainId().then(chainId => {
            return this._getSequence(from).then(sequence => {
              let txn = this.buildTxn(from, address, permValue, sequence);
              const signatories = this._setSignatories(
                chainId,
                PERM_TX_TYPE,
                txn,
                privKey
              );
              return this.broadcast(chainId, PERM_TX_TYPE, txn, signatories);
            });
          });
      }

      buildTxn(modifier, modified, permValue, sequence) {
        const permTxn = {
            modifier: {
              address: modifier,
              amount: 0,
              sequence: sequence
            },
            modified: {
              address: modified,
              amount: 0
            },
            permissions : permValue,
            set : true
          };
        return permTxn;
      }
  }
module.exports = PermissionTx;