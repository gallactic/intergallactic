'use strict';

const abiUtil = require('./abi');

class ContractMethod {
  constructor(igc, fn, args) {
    this.igc = igc;
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
}

exports.ContractMethod = ContractMethod;