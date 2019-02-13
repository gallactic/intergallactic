'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var expect = glOrWd.expect;
var BigNumber = glOrWd.BigNumber;

var errorMessage;
var _contractTd = {};

var testAcc = glOrWd.testAcc;

_contractTd.instantiate = {
  valid: [
    // should create simple contract with one method from abi with implicit type name
    {
      input: {
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
          address: '0x'
        }
      },
      validate: (output) => {
        expect(output.getNumber).to.be.a('function');
      }
    },
    // should create contract with multiple methods
    {
      input: {
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":false,"inputs":[{"name":"n","type":"int256"}],"name":"setNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
          address: '0x'
        }
      },
      validate: (output) => {
        expect(output.getNumber).to.be.a('function');
        expect(output.setNumber).to.be.a('function');
      }
    },
    {
      input: {
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
          address: '0x'
        }
      },
      validate: (output) => {
        expect(output.sam).to.be.a('function');
        // expect(output.sam('dave', true, [1, 2, 3]).encodeABI()).to.equal('a5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003');
        expect(output.baz).to.be.a('function');
        expect(output.bar).to.be.a('function');
      }
    }
  ]
};

_contractTd.deploy = {
  valid: [
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [ { "constant": false, "inputs": [], "name": "stake2", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "stake", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "x", "type": "address" } ], "name": "send", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "x", "type": "address" } ], "name": "sendBalance", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "address" } ], "name": "balance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
          byteCode: '6060604052341561000f57600080fd5b61018a8061001e6000396000f30060606040526004361061006c5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305ea3cf181146100715780633a4b66f11461007c5780633e58c58c146100865780635292af1f1461009a578063e3d670d7146100ae575b600080fd5b341561007c57600080fd5b6100846100df565b005b610084600160a060020a03600435166100e1565b610084600160a060020a0360043516610116565b34156100b957600080fd5b6100cd600160a060020a0360043516610151565b60405190815260200160405180910390f35b565b600160a060020a0381163480156108fc0290604051600060405180830381858888f19350505050151561011357600080fd5b50565b80600160a060020a03166108fc61012c30610151565b9081150290604051600060405180830381858888f19350505050151561011357600080fd5b600160a060020a031631905600a165627a7a723058206f2bbf09ded1fb7cf6d8367a1d227a9d50bdfe46c8ef967249b05806104a7ee50029',
          gasLimit: 80000000,
          payable: 0
        }
      },
      validate: (output) => {
      }
    }
    // // should be able to deploy simple contract
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant": false,"inputs": [{"name": "value","type": "int256"}],"name": "foo","outputs": [{"name": "","type": "int256"}],"payable": false,"stateMutability": "nonpayable","type": "function"}],
    //       byteCode: '60606040523415600e57600080fd5b60978061001c6000396000f300606060405260043610603e5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416634c970b2f81146043575b600080fd5b3415604d57600080fd5b60566004356068565b60405190815260200160405180910390f35b905600a165627a7a723058203f45bfdf50f331b25dba6ab886c341fb36c06e463317f6f4fe9c5c16ed5a31dd0029',
    //       gasLimit: 800000,
    //       payableAmt: 0
    //     },
    //     // code: 'pragma solidity ^0.4.16; contract Foo { function bar(bytes3[2] memory) public pure {} function baz(uint32 x, bool y) public pure returns (bool r) { r = x > 32 || y; } function sam(bytes memory, bool, uint[] memory) public pure {} }'
    //     // code: 'pragma solidity ^0.5.1;contract test { int number; constructor (int initial) public { number = initial; } function getNumber () public view returns (int) { return number; } function setNumber (int n) public { number = n; } }'
    //   },
    //   validate: (output) => {
    //   }
    // },
  ]
};

_contractTd.methods = {
  valid: [
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [ { "constant": false, "inputs": [], "name": "stake2", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "stake", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "x", "type": "address" } ], "name": "send", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "x", "type": "address" } ], "name": "sendBalance", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "address" } ], "name": "balance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
          byteCode: '6060604052341561000f57600080fd5b61018a8061001e6000396000f30060606040526004361061006c5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305ea3cf181146100715780633a4b66f11461007c5780633e58c58c146100865780635292af1f1461009a578063e3d670d7146100ae575b600080fd5b341561007c57600080fd5b6100846100df565b005b610084600160a060020a03600435166100e1565b610084600160a060020a0360043516610116565b34156100b957600080fd5b6100cd600160a060020a0360043516610151565b60405190815260200160405180910390f35b565b600160a060020a0381163480156108fc0290604051600060405180830381858888f19350505050151561011357600080fd5b50565b80600160a060020a03166108fc61012c30610151565b9081150290604051600060405180830381858888f19350505050151561011357600080fd5b600160a060020a031631905600a165627a7a723058206f2bbf09ded1fb7cf6d8367a1d227a9d50bdfe46c8ef967249b05806104a7ee50029',
          gasLimit: 80000000,
          payable: 0
        },
        methodName: 'send',
        methodValue: ['1000'],
        methodGasLimit: 800000
      },
      validate: (res) => {
        
      }
    }
    // should be able to call contract method
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant": false,"inputs": [{"name": "value","type": "int256"}],"name": "foo","outputs": [{"name": "","type": "int256"}],"payable": false,"stateMutability": "nonpayable","type": "function"}],
    //       byteCode: '60606040523415600e57600080fd5b60978061001c6000396000f300606060405260043610603e5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416634c970b2f81146043575b600080fd5b3415604d57600080fd5b60566004356068565b60405190815260200160405180910390f35b905600a165627a7a723058203f45bfdf50f331b25dba6ab886c341fb36c06e463317f6f4fe9c5c16ed5a31dd0029',
    //       gasLimit: 800000,
    //       payableAmt: 0
    //     },
    //     methodName: 'foo',
    //     methodValue: [10],
    //     methodGasLimit: 800000
    //   },
    //   validate: (res) => {
        
    //   }
    // },
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant":false,"inputs":[{"name":"n","type":"int256"}],"name":"setNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
    //       address: '0xca35b7d915458ef540ade6068dfe2f44e8fa733c'
    //     },
    //     methodName: 'setNumber',
    //     methodValue: [10]
    //   },
    //   validate: (output) => {
    //     expect(output).to.eql('9cf27f37000000000000000000000000000000000000000000000000000000000000000a')
    //   }
    // },
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
    //       address: '0x'
    //     },
    //     methodName: 'sam',
    //     methodValue: ['dave', true, [1, 2, 3]]
    //   },
    //   validate: (output) => {
    //     expect(output).to.equal('a5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003');
    //   }
    // },
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
    //       address: '0x'
    //     },
    //     methodName: 'baz',
    //     methodValue: [69, true]
    //   },
    //   validate: (output) => {
    //     expect(output).to.equal('cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001');
    //     // expect(output.baz(69, true).encodeABI()).to.equal('cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001');
    //   }
    // },
    // {
    //   input: {
    //     privKey: testAcc.privKey,
    //     contract: {
    //       // eslint-disable-next-line
    //       abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
    //       address: '0x'
    //     },
    //     methodName: 'bar',
    //     methodValue: [['abc', 'def']]
    //   },
    //   validate: (output) => {
    //     expect(output).to.equal('fce353f661626300000000000000000000000000000000000000000000000000000000006465660000000000000000000000000000000000000000000000000000000000');
    //   }
    // }
  ]
}

if (typeof window !== 'undefined') {
  window._contractTd = _contractTd;
}
else {
  module.exports = { _contractTd };
}