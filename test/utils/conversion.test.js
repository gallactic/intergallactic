'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
let testData = require('./testData.js');

describe('igc.utils.conversion', () => {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('should have "getUnit" function', () => {
    expect(igc.utils.conversion.getUnitValue).to.be.a('function');
  });

  it('should have "fromBoson" function', () => {
    expect(igc.utils.conversion.fromBoson).to.be.a('function');
  });

  it('should have "toBoson" function', () => {
    expect(igc.utils.conversion.toBoson).to.be.a('function');
  });

  it('"getUnitValue" should return the "boson" value based on given unit', (done) => {
    let test={
      function: (input) => {
        let result = igc.utils.conversion.getUnitValue(input.unit);
        return result;
      },
      validate: (output) => {}
    };
    test.data = testData.conversionTest.getUnitValue.valid;
    glOrWd.runTest(test, done);
  });

  it('"getUnitValue" should throw an error, provided invalid data as input', (done) => {
    let test={
      function: (input) => {
        try {
          let result = igc.utils.conversion.getUnitValue(input.unit);
          return result;
        }
        catch (e){
          return e;
        }
      },
      validate: (output) => {}
    };
    test.data = testData.conversionTest.getUnitValue.invalid;
    glOrWd.runTest(test, done);
  });

  it('"fromBoson" should convert boson value to given unit value', (done) => {
    const test = {
      function: (input) => {
        let result = igc.utils.conversion.fromBoson(input.number, input.unit)
        return result;
      },
      validate: (output) => {
        expect(igc.utils.util.isBigNumber(output)).to.equal(true);
      }
    };
    test.data = testData.conversionTest.fromBoson.valid;
    glOrWd.runTest(test, done);
  });

  it('"fromBoson" should throw an error or return NaN, provided invalid data as input', (done) => {
    const test = {
      function: (input) => {
        try {
          let result = igc.utils.conversion.fromBoson(input.number, input.unit)
          return result;
        }
        catch (e) {
          return e;
        }
      },
      validate: (output) => {}
    };
    test.data = testData.conversionTest.fromBoson.invalid;
    glOrWd.runTest(test, done);
  });

  it('"toBoson" should convert value to given unit value', (done) => {
    const test = {
      function: (input) => {
        let result = igc.utils.conversion.toBoson(input.number, input.unit);
        return result;
      },
      validate: (output) => {
        expect(igc.utils.util.isBigNumber(output)).to.equal(true);
        expect(output.toNumber()).to.equal(1000000000000000000);
      }
    };
    test.data = testData.conversionTest.toBoson.valid;
    glOrWd.runTest(test, done);
  });

  it('"toBoson" should , provided invalid data as input', (done) => {
    const test = {
      function: (input) => {
        try {
          let result = igc.utils.conversion.toBoson(input.number, input.unit);
          return result;
        }
        catch (e) {
          return e;
        }
      },
      validate: (output) => {}
    };
    test.data = testData.conversionTest.toBoson.invalid;
    glOrWd.runTest(test, done);
  });
});