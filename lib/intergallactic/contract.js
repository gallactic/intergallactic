
'use strict';

const abiUtil = require('../utils/abi'),
  config = require('../config/constant'),
  ContractMethod = require('./contract.method'),

  DEPLOYMENT_ADDRESS = config.gallactic.transaction.deploymentAddress;

/**
 * This is a feature that lets you compile and deploy your own contract
 * on gallactic network. Besides that, this class also allow building
 * transaction data field for call transaction
 *
 * @example
 * const igc = require('intergallactic');
 * const igc = new igc({ url: glOrWd.tnet, protocol: 'jsonrpc' })
 * const Contract = igc.Contract;
 * let myContract = new Contract({
 *   abi: <abi array>,
 *   byteCode: <byte code>, // optional, for deployment purpose
 *   payableAmt: <amount>,
 *   gasLimit: <gas limit>
 * });
 * myContract.deploy(<private key>)
 */
class Contract {
  /**
   * Initiate contract object. This requires code or abi array
   * @param {Object} igc Intergallactic instance
   * @param {Object} contract String of the solidity code or Abi array
   */
  constructor (igc, contract) {
    this.igc = igc;

    if (!contract.abi) {
      throw new Error('Instantiate require valid "abi" array! Unable to proceed.');
    }

    this._abi = contract.abi;
    if (contract.address) this._address = contract.address;
    if (contract.byteCode) this._byteCode = contract.byteCode;
    if (contract.gasLimit) this._gasLimit = contract.gasLimit;
    if (contract.payableAmt) this._amount = contract.payableAmt;
    // extend when address field available
    if (this._address) extend(this, this._abi, this._address);
  }

  /**
   * Contract deployment feature to deploy contract in the blockchain with support
   * passing arguments to constructor
   *
   * @param   {[type]}  privateKey  [description]
   * @param   {Object}  contract  [description]
   * @param   {Object}  option  [description]
   *
   * @return  {[type]}  [description]
   */
  deploy (privateKey, args = [], contract = {}) {
    if (!this._byteCode && !contract.byteCode) {
      throw new Error('Deployment of a contract require valid "byteCode" value! Unable to proceed.');
    }
    if (args && args.length > 0) {
      // get abi array constructor input types
      const constructor = this._abi.find(e => e.type === 'constructor');
      const inputTypes = constructor.inputs.map(e => e.type);
      let output = [];
      // encode parameters
      output.push(abiUtil.rawEncode(inputTypes, args).toString('hex'));
      this._argsByteCode = output.join('');
    }
    let newTx = {
      to: DEPLOYMENT_ADDRESS,
      amount: this._amount || contract.payableAmt || 0,
      gasLimit: this._gasLimit || contract.gasLimit || 0,
      data: this._byteCode || contract.byteCode
    };
    const callTx = new this.igc.TransactionV2(newTx);
    return callTx.call(privateKey);
  }
}

/**
 * PRIVATE METHODS
 */

function extend (contract, abi, address) {
  if (!Array.isArray(abi)) {
    abi = [abi];
  }

  abi.forEach(e => {
    if (e.type === 'function') createFunction(contract, address, e);
  });
}

function createFunction (contract, address, fn) {
  if (!fn.name) return;

  contract[fn.name] = function () {
    return new ContractMethod(contract.igc, address, fn, arguments)
  };
}

module.exports = Contract;