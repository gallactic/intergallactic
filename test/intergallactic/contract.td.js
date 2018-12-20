'use strict';

var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var BigNumber = typeof window !== 'undefined' ? window.BigNumber : require('bignumber.js');

var errorMessage;
var _contractTd = {};

const testAcc = {
  address: 'acFVrNat8Y8Evid4fcJzN5KxyEAyuHS6Tuu',
  privKey: 'ski47BSAmY6PJ9KMHXHMzk7tG8nXTJaKKF2BTRPzmjJ3NAzy1HxMAz336JiN7N8KzF786T2mptHHbBY5fmFeoaNukokkF66',
  pubKey: 'pkCogxsiXdTj9yn62cXN6L5NHwcrBfS8N2bYhob4HTPDExJfWpD'
}

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
    // should be able to deploy simple contract
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":false,"inputs":[{"name":"n","type":"int256"}],"name":"setNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
          byteCode: '608060405234801561001057600080fd5b5060405160208061010d8339810180604052602081101561003057600080fd5b505160005560ca806100436000396000f3fe6080604052600436106042577c010000000000000000000000000000000000000000000000000000000060003504639cf27f3781146047578063f2c9ecd814606f575b600080fd5b348015605257600080fd5b50606d60048036036020811015606757600080fd5b50356093565b005b348015607a57600080fd5b5060816098565b60408051918252519081900360200190f35b600055565b6000549056fea165627a7a723058202650623bb64748254160f7b6dc0bb51ae0062aa9a33c575889ade0058d12ca0c0029',
          gasLimit: 21000,
          payableAmt: 0
        },
        args: [1, 2]
        // code: 'pragma solidity ^0.4.16; contract Foo { function bar(bytes3[2] memory) public pure {} function baz(uint32 x, bool y) public pure returns (bool r) { r = x > 32 || y; } function sam(bytes memory, bool, uint[] memory) public pure {} }'
        // code: 'pragma solidity ^0.5.1;contract test { int number; constructor (int initial) public { number = initial; } function getNumber () public view returns (int) { return number; } function setNumber (int n) public { number = n; } }'
      },
      validate: (output) => {

      }
    }
  ]
};

_contractTd.methods = {
  valid: [
    // should be able to call contract method
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":false,"inputs":[{"name":"n","type":"int256"}],"name":"setNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumber","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
          address: '0xca35b7d915458ef540ade6068dfe2f44e8fa733c'
        },
        methodName: 'setNumber',
        methodValue: [10]
      },
      validate: (output) => {
        expect(output).to.eql('9cf27f37000000000000000000000000000000000000000000000000000000000000000a')
      }
    },
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
          address: '0x'
        },
        methodName: 'sam',
        methodValue: ['dave', true, [1, 2, 3]]
      },
      validate: (output) => {
        expect(output).to.equal('a5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003');
      }
    },
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
          address: '0x'
        },
        methodName: 'baz',
        methodValue: [69, true]
      },
      validate: (output) => {
        expect(output).to.equal('cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001');
        // expect(output.baz(69, true).encodeABI()).to.equal('cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001');
      }
    },
    {
      input: {
        privKey: testAcc.privKey,
        contract: {
          // eslint-disable-next-line
          abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}],
          address: '0x'
        },
        methodName: 'bar',
        methodValue: [['abc', 'def']]
      },
      validate: (output) => {
        expect(output).to.equal('fce353f661626300000000000000000000000000000000000000000000000000000000006465660000000000000000000000000000000000000000000000000000000000');
      }
    }
  ]
}

if (typeof window !== 'undefined') {
  window._contractTd = _contractTd;
}
else {
  module.exports = { _contractTd };
}