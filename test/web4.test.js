'use strict';

const Web4 = typeof window !== 'undefined' ? window.Web4 : require('../index');
const expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;

function instantiateWeb4 () {
  return new Web4({ url: 'http://localhost:5050', protocol: 'jsonrpc' });
}

/**
 * To do test in a waterfall sequence manner for asynchronous tests that using promise
 * @param {Array} test [An array of object that contains "function", "data"]
 * @param {Function} test.function [A function that executes the test. it take test.input AND MUST RETURN PROMISE]
 * @param {Object} test.data.input [An object that contains test input value]
 * @param {Function} test.data.validate [A validator function to validate the test]
 * @param {Function} done [a callback to report mocha that the running test is completed]
 * @param {Integer} count [a counter value of running test]
 */
global.runTest = function (test, done, count = 0) {
  if (test.data.length === count) {
    return done();
  }

  let beforeTest = test.before ? test.before(count) : Promise.resolve();
  let res = beforeTest
    .then(() => test.function(test.data[count].input));
  if (res.then && typeof res.then === 'function') {
    res
      .then(output => {
        test.validate(output, count);
        if (test.data[count].validate) {
          test.data[count].validate(output);
        }
        global.runTest(test, done, ++count);
      })
      .catch(done);
  } else {
    test.validate(res);
    if (test.data[count].validate) {
      test.data[count].validate(res);
    }
  }
};

before('instantiate web4', function () {
  instantiateWeb4();
});

/**
 * Web4 library should act as the parent class that sets the provider
 * for other class to interact with the blockchain node. if provider
 * not provided, it should throw an error. and other child that require
 * provider to interact to blockchain node will not work
 */
describe('Web4', function () {
  const web4 = instantiateWeb4();

  it('should have "setConnection" property', function () {
    expect(web4.setConnection).to.be.a('function');
  });

  it('should have "conn" property', function () {
    expect(web4.conn).to.be.an('object');
  });

  it('should have "account" property', function () {
    expect(web4.account).to.be.an('object');
  });

  it('should have "gltc" property', function () {
    expect(web4.gltc).to.be.an('object');
  });

  it('should have "Txn" property', function () {
    expect(web4.Txn).to.be.a('function');
  });

  it('should have "util" property', function () {
    expect(web4.util).to.be.an('object');
  });

  it('should have "version" property', function () {
    expect(web4.version).to.be.an('object');
  });
});

describe('Web4.setConnection', function () {
  const web4 = instantiateWeb4();

  it('should set web4.conn property and return connection object', function () {
    expect(web4.setConnection('http://localhost:4040', 'jsonrpc')).to.be.an('object');
    expect(web4.conn.url).to.equal('http://localhost:4040');
  });
});
