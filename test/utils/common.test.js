'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
let commonTestData = glOrWd.testDataUtil.commonTest;

describe('Intergallactic.utils.util', function () {
  const igc = new Intergallactic({
    url: glOrWd.tnet,
    protocol: 'jsonrpc'
  });
  it('should have "generateUuid" function', function () {
    expect(igc.utils.util.generateUuid).to.be.a('function');
  });

  it('should have "isBigNumber" function', function () {
    expect(igc.utils.util.isBigNumber).to.be.a('function');
  });

  it('should have "toBigNumber" function', function () {
    expect(igc.utils.util.toBigNumber).to.be.a('function');
  });

  it('"generateUuid" should return a string', function (done) {
    const test = {
      function: (input) => {
        return igc.utils.util.generateUuid(input.length);
      },
      validate: (output) => {
        expect(output).to.be.a('string');
        expect(output.length).to.equal(36);
      }
    };
    test.data = [{
      input: {}
    }]
    glOrWd.runTest(test, done);
  });


  it('"isBigNumber" should return a boolean true, provided Big Number as a parameter', function (done) {
    const test = {
      function: (input) => {
        const result = igc.utils.util.isBigNumber(input.number);
        return result;
      },
      validate: (output) => { }
    };
    test.data = commonTestData.isBigNumber.valid;
    glOrWd.runTest(test, done);
  });

  /*** Null and empty string (in the following test script) will return null and empty string, respectively ***/
  it('"isBigNumber" should return a boolean false, provided a parameter that is not a Big Number', function (done) {
    const test = {
      function: (input) => {
        const result = igc.utils.util.isBigNumber(input.number);
        return result;
      },
      validate: (output) => { }
    };
    test.data = commonTestData.isBigNumber.invalid;
    glOrWd.runTest(test, done);
  });

  it('"toBigNumber" should return a big number based on given value', function (done) {
    const test = {
      function: (input) => {
        const result = igc.utils.util.toBigNumber(input.number);
        return result;
      },
      validate: (output) => { }
    };
    test.data = commonTestData.toBigNumber.valid;
    glOrWd.runTest(test, done);
  });

  it('"toBigNumber" should not return a big number based on invalid inputs', function (done) {
    let test = {
      function: (input) => {
        let result = igc.utils.util.toBigNumber(input.number);
        return result;
      },
      validate: (output) => { }
    };
    test.data = commonTestData.toBigNumber.invalid;
    glOrWd.runTest(test, done);
  });
});