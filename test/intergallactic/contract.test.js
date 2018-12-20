'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
let contractTd = (typeof window !== 'undefined' ? window : require('./contract.td'))._contractTd;

describe.only('igc.Contract', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const Contract = igc.Contract;

  it('should be able to "instantiate" contract', function (done) {
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        return myContract;
      },
      validate: (res) => {
        expect(res instanceof Error).to.equal(false);
      }
    }

    test.data = contractTd.instantiate.valid;
    glOrWd.runTest(test, done);
  });

  it.skip('should be able to "deploy" new contract', function (done) {
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        return myContract.deploy(input.privKey, input.deploy);
      },
      validate: (res) => {
        // expect(res instanceof Error).to.equal(false);
        // expect(res.statusCode).to.equal(200);
        // expect(res.body.error).to.equal(undefined);
        // expect(res.body.result).to.be.an('object');
        // expect(res.body.result.TxHash).to.be.a('string');
      }
    };
    test.data = contractTd.deploy.valid;

    glOrWd.runTest(test, done);
  });

  it('should be able to execute contract "encodeABI" after instantiate contract with address', function (done) {
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        // return myContract[input.methodName](input.methodValue).encodeABI();
        // return (myContract[input.methodName].call(null, input.methodValue)).encodeABI();
        return myContract[input.methodName].apply(this, input.methodValue).encodeABI();
      },
      validate: (res) => {
        expect(res instanceof Error).to.equal(false);
      }
    }

    test.data = contractTd.methods.valid;
    glOrWd.runTest(test, done);
  });

  it('should be able to execute contract "call" after instantiate contract with address', function (done) {
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        return myContract[input.methodName].apply(this, input.methodValue).call();
      },
      validate: (res) => {
        expect(res instanceof Error).to.equal(false);
      }
    }

    test.data = contractTd.methods.valid;
    glOrWd.runTest(test, done);
  });

  it.skip('should be able to call contract "ABI Methods" after deployment', function (done) {
    throw new Error('Implementation')
    // const test = {
    //   function: (input) => {
    //     const myContract = new Contract(input);

    //     return myContract;
    //   },
    //   validate: (res) => {
    //     expect(res instanceof Error).to.equal(false);
    //   }
    // }

    // test.data = contractTd.instantiate.valid;
    // glOrWd.runTest(test, done);
  });
});