'use strict';

const abiUtil = require('../utils/abi');

class ContractMethod {
  constructor(contract, address, fn, args) {
    this.contract = contract;
    this.igc = contract.igc;
    this.name = fn.name;
    this.inputs = fn.inputs;
    this.outputs = fn.outputs;
    this.args = Object.keys(args).map(e => args[e]);

    this.inputTypes = this.inputs.map(e => e.type);
    this.outputTypes = this.outputs.map(e => e.type);
    if (address || contract.address) this.address = address || contract.address;
  }
  
  encodeABI() {
    let output = [];
    output.push(abiUtil.eventID(this.name, this.inputTypes).slice(0, 8));
    output.push(abiUtil.rawEncode(this.inputTypes, this.args).toString('hex'));

    return output.join('');
  }

  call (privateKey, option) {
    // assign address. This apply for scenario where contract deployed and the method is being called after that
    if (this.contract._address) this.address = this.contract._address;
    // if still no address can be found then will throw error
    if (!this.address) throw new Error('contract is not assigned with address of the deployed contract')
    let newTx = {
      to: this.address,
      amount: this.args.amount || 0,
      gasLimit: option.gasLimit || 21000,
      data: this.encodeABI()
    };

    const callTx = new this.igc.Transaction(newTx);
    return callTx.call(privateKey)
      .then(res => {
        if (res && res.body && res.body.result) {
          // let decodedOutput = Buffer.from(res.body.result.output, 'hex');
          // decodedOutput = abiUtil.rawDecode(this.outputTypes, decodedOutput);
          // decodedOutput = decodedOutput.toString('hex');
          // res.body.result.DecodedOutput = decodedOutput;
        }
        return res;
      });
  }
}

module.exports = ContractMethod;