'use strict';

const abiUtil = require('../utils/abi');

class ContractMethod {
  constructor(igc, address, fn, args) {
    this.igc = igc;
    this.address = address;
    this.name = fn.name;
    this.inputs = fn.inputs;
    this.outputs = fn.outputs;
    this.args = Object.keys(args).map(e => args[e]);

    this.inputTypes = this.inputs.map(e => e.type);

  }

  encodeABI() {
    let output = [];
    output.push(abiUtil.eventID(this.name, this.inputTypes).slice(0, 8));
    output.push(abiUtil.rawEncode(this.inputTypes, this.args).toString('hex'));

    return output.join('');
  }

  call (privateKey) {
    let newTx = {
      to: this.address,
      amount: args.amount || 0,
      gasLimit: 1,
      data: this._byteCode
    };
    const callTx = new this.igc.TransactionV2(newTx);
    return callTx.call(privateKey);
    // if (!this.bytecode) {
    //   throw new Error('Contract does not have byte code upon instatiate! Unable to proceed.')
    // }

    // tx.data = this.encodeABI();
    // let txOpt = { type: this.igc.CALL_TXN_TYPE };
    // let newTx = new this.igc.Txn(tx, txOpt);
    // return newTx.signNBroadcast(privateKey);
  }
}

module.exports = ContractMethod;