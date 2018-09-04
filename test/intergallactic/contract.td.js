'use strict';

var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var BigNumber = typeof window !== 'undefined' ? window.BigNumber : require('bignumber.js');

var errorMessage;
var _contractTd = {};

_contractTd = {
  instantiate: {
    valid: [
      // should create simple contract with one method from abi with implicit type name
      {
        input: {
          abi: [{ name: 'test', type: 'function', inputs: [{ name: 'a', type: 'uint256' }], outputs: [{ name: 'd', type: 'uint256' }] }]
        },
        validate: (output) => {
          expect(output.test).to.be.a('function');
        }
      },
      // should create contract with multiple methods
      {
        input: {
          abi: [{ name: 'test', type: 'function', inputs: [{ name: 'a', type: 'uint256' }], outputs: [{ name: 'd', type: 'uint256' }] }, { name: 'test2', type: 'function', inputs: [{ name: 'a', type: 'uint256' }], outputs: [{ name: 'd', type: 'uint256' }] }]
        },
        validate: (output) => {
          expect(output.test).to.be.a('function');
          expect(output.test2).to.be.a('function');
        }
      },
      {
        input: {
          abi: [{ name: 'test', inputs: [{ name: 'a', type: 'uint256' }], outputs: [{ name: 'd', type: 'uint256' }] }]
        },
        validate: (output) => {
          expect(output.test).to.be.a('undefined');
        }
      },
      {
        input: {
          abi: [{"constant":true,"inputs":[{"name":"","type":"bytes"},{"name":"","type":"bool"},{"name":"","type":"uint256[]"}],"name":"sam","outputs":[],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint32"},{"name":"y","type":"bool"}],"name":"baz","outputs":[{"name":"r","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes3[2]"}],"name":"bar","outputs":[],"payable":false,"stateMutability":"pure","type":"function"}]
        },
        validate: (output) => {
          expect(output.sam).to.be.a('function');
          expect(output.sam('dave', true, [1, 2, 3]).encodeABI()).to.equal('a5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003');
          expect(output.baz).to.be.a('function');
          expect(output.baz(69, true).encodeABI()).to.equal('cdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001');
          expect(output.bar).to.be.a('function');
          expect(output.bar(['abc', 'def']).encodeABI()).to.equal('fce353f661626300000000000000000000000000000000000000000000000000000000006465660000000000000000000000000000000000000000000000000000000000');
        }
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window._contractTd = _contractTd;
}
else {
  module.exports = { _contractTd };
}