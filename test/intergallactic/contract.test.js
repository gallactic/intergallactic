'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
let contractTd = (typeof window !== 'undefined' ? window : require('./contract.td'))._contractTd;

describe('igc.Contract', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const Contract = igc.Contract;
  // const ERC20_ABI = [{'constant': true, 'inputs': [{'name': '_owner', 'type': 'address'}], 'name': 'balanceOf', 'outputs': [{'name': 'balance', 'type': 'uint256'}], 'payable': false, 'type': 'function'}]
  // const myContract = new Contract(ERC20_ABI);

  // it('should have "deploy" function', () => expect(typeof myContract.deploy === 'function').to.equal(true));

  it('should be able to "instantiate" new contract given abi array', function (done) {
    const test = {
      function: (input) => {
        const myContract = new Contract(input.abi);

        return myContract;
      },
      validate: (output) => {
        expect(output instanceof Error).to.equal(false);
      }
    }

    test.data = contractTd.instantiate.valid;
    glOrWd.runTest(test, done);
  });
});