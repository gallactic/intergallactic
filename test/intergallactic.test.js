'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
glOrWd.tnet = 'http://192.168.0.10:1338/rpc';

function instantiateIGC () {
  return new Intergallactic({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });
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
glOrWd.runTest = function (test, done, count = 0) {
  if (!test.data) {
    throw new Error('"runTest" require test data in order to run the test');
  }

  if (test.data.length === count) {
    return done();
  }

  let beforeTest = test.before ? test.before(test.data[count].input) : null;
  let res = beforeTest && typeof beforeTest.then === 'function' ?
    beforeTest.then(() => test.function(test.data[count].input)) :
    test.function(test.data[count].input);

  if (res && typeof res.then === 'function') {
    res
      .then(output => {
        test.validate(output, test.data[count].input);
        if (test.data[count].validate) {
          test.data[count].validate(output, test.data[count].input);
        }
        glOrWd.runTest(test, done, ++count);
      })
      .catch(done);
  } else {
    test.validate(res, test.data[count].input);
    if (test.data[count].validate) {
      test.data[count].validate(res, test.data[count].input);
    }
    glOrWd.runTest(test, done, ++count);
  }
};

before('instantiate intergallactic', function () {
  instantiateIGC();
});

/**
 * Intergallactic library should act as the parent class that sets the provider
 * for other class to interact with the blockchain node. if provider
 * not provided, it should throw an error. and other child that require
 * provider to interact to blockchain node will not work
 */
describe('Intergallactic', function () {
  const intergallactic = instantiateIGC();

  it('should have "setConnection" property', function () {
    expect(intergallactic.setConnection).to.be.a('function');
  });

  it('should have "conn" property', function () {
    expect(intergallactic.conn).to.be.an('object');
  });

  it('should have "account" property', function () {
    expect(intergallactic.account).to.be.an('object');
  });

  it('should have "gltc" property', function () {
    expect(intergallactic.gltc).to.be.an('object');
  });

  it('should have "Txn" property', function () {
    expect(intergallactic.Txn).to.be.a('function');
  });

  it('should have "utils" property', function () {
    expect(intergallactic.utils).to.be.an('object');
  });

  it('should have "version" property', function () {
    expect(intergallactic.version).to.be.an('object');
  });

  // it('should have "isConnected" function', function () {
  //   expect(intergallactic.isConnected)
  // })
});

describe('Intergallactic.setConnection', function () {
  const igc = instantiateIGC();

  it('should set igc.conn property and return json rpc connection object', function () {
    expect(igc.setConnection('http://54.95.41.253:1337/rpc', 'jsonrpc')).to.be.an('object');
    expect(igc.conn.url).to.equal('http://54.95.41.253:1337/rpc');
  });
});
