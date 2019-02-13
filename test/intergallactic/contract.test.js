'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
let contractTd = (typeof window !== 'undefined' ? window : require('./contract.td'))._contractTd;

describe('igc.Contract', function () {
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

  it('should be able to "deploy" new contract', function (done) {
    this.timeout(10000)
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        return myContract.deploy(input.privKey);
      },
      validate: (res) => {
        expect(res instanceof Error).to.equal(false);
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object'); 
      }
    };
    test.data = contractTd.deploy.valid;

    glOrWd.runTest(test, done);
  });

  it('should be able to execute contract "encodeABI" after instantiate contract', function (done) {
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

  it('should be able to execute contract "call" after instantiate contract and success deployment', function (done) {
    this.timeout(30000)
    const test = {
      function: (input) => {
        const myContract = new Contract(input.contract);
        return myContract.deploy(input.privKey, input.deploy).then(res => {          
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              myContract[input.methodName]
                .apply(this, input.methodValue)
                .call(input.privKey, { gasLimit: input.methodGasLimit })
                .then(resolve)
                .catch(reject)
            }, 2000)
          })
        });
      },
      validate: (res) => {
        expect(res instanceof Error).to.equal(false);
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        // let data = res.body.result;
        // expect(data.status).to.equal(0);
        // expect(data.output).to.equal('000000000000000000000000000000000000000000000000000000000000000a')
        // expect(data.DecodedOutput).to.equal('10')
      }
    }

    test.data = contractTd.methods.valid;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000)
  });
});