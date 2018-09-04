
'use strict';

const abiUtil = require('./abi'),
  { ContractMethod } = require('./contract.method');

/**
 * This is a feature that lets you compile and deploy your own contract
 * on gallactic network. Besides that, this class also allow building
 * transaction data field for call transaction
 *
 * @example
 * const igc = require('intergallactic');
 * const igc = new igc({ url: glOrWd.tnet, protocol: 'jsonrpc' })
 * const Contract = igc.Contract;
 * let code = 'contract Greeter is Mortal { string greeting; function Greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } }';
 * let abi = Contract.compile(code);
 * let myContract = new Contract(abi);
 */
class Contract {
  /**
   * Initiate contract object. This requires code or abi array
   * @param {Object} igc Intergallactic instance
   * @param {String|array} codeOrAbi String of the solidity code or Abi array
   */
  constructor (igc, codeOrAbi) {
    this.igc = igc;

    if (!codeOrAbi || !Array.isArray(codeOrAbi)) {
      throw new Error('Contract require abi array! Unable to proceed.');
    }

    this.abi = codeOrAbi;

    // extend contract based on functions declared on given abi
    extend(this, this.abi);
  }

  deploy () {
    throw new Error('Pending for implementation!');
  }

  extend (abi) {
    return extend(this, abi);
  }
}

/**
 * PRIVATE METHODS
 */

function extend (contract, abi) {
  if (!Array.isArray(abi)) {
    abi = [abi];
  }

  abi.forEach(e => {
    if (e.type === 'function') createFunction(contract, e);
  });
}

function createFunction (contract, fn) {
  if (!fn.name) return;

  contract[fn.name] = function () {
    return new ContractMethod(this.igc, fn, arguments)
  }
}

module.exports = Contract;