'use strict';

var Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);

describe('web4.utils.conversion', () => {
  const web4 = new Web4({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('should have "getUnit" function', () => {
    expect(web4.utils.conversion.getUnitValue).to.be.a('function');
  });

  it('should have "fromBoson" function', () => {
    expect(web4.utils.conversion.fromBoson).to.be.a('function');
  });

  it('should have "toBoson" function', () => {
    expect(web4.utils.conversion.toBoson).to.be.a('function');
  });

  it('"getUnitValue" should return the "boson" value based on given unit', (done) => {
    const test = {
      function: (input) => {
        return web4.utils.conversion.getUnitValue(input.unit)
      },
      validate: (output) => {
        expect(output).to.be.a('number');
      }
    }
    test.data = [{
      input: { unit: 'boson' },
      validate: (output) => {
        expect(output).to.equal(1)
      }
    }, {
      input: { unit: 'gtx' },
      validate: (output) => {
        expect(output).to.equal(1000000000000000000)
      }
    }, {
      input: { unit: 'teragtx' },
      validate: (output) => {
        expect(output).to.equal(1000000000000000000000000000000)
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"fromBoson" should convert boson value to given unit value', (done) => {
    const test = {
      function: (input) => {
        return web4.utils.conversion.fromBoson(input.number, input.unit);
      },
      validate: (output) => {
        expect(web4.utils.util.isBigNumber(output)).to.equal(true);
      }
    };

    test.data = [{
      // input with number value
      input: { number: 1000000000000000000, unit: 'gtx' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1);
      }
    }, {
      // input with hex string value
      input: { number: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd', unit: 'gtx' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933 / 1000000000000000000);
      }
    }, {
      // input with string value and minus
      input: { number: '-15', unit: 'kboson' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(-(15 / 1000));
      }
    }, {
      // input without unit value, by default should convert to "gtx"
      input: { number: '1000000000000000000' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1);
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"toBoson" should convert value to given unit value', (done) => {
    const test = {
      function: (input) => {
        return web4.utils.conversion.toBoson(input.number, input.unit);
      },
      validate: (output) => {
        expect(web4.utils.util.isBigNumber(output)).to.equal(true);
      }
    };

    test.data = [{
      input: { number: 1, unit: 'gtx' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1000000000000000000);
      }
    }, {
      input: { number: '1', unit: 'gtx' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1000000000000000000);
      }
    }, {
      input: { number: '0x1', unit: 'gtx' },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1000000000000000000);
      }
    }, {
      // input without unit value, by default should convert from "gtx"
      input: { number: 1 },
      validate: (output) => {
        expect(output.toNumber()).to.equal(1000000000000000000);
      }
    }]
    glOrWd.runTest(test, done);
  });

});