'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var expect = glOrWd.expect;
var BigNumber = glOrWd.BigNumber;

var errorMessage;
var _commonTd = {};

// sbo, stands for "should be ok"
// snbo, stands for "should not be ok"
_commonTd = {
  isBigNumber: {
    valid: [
      // use big number value sbo
      {
        input: {
          number: new BigNumber()
        },
        validate: (output) => {
          expect(output).to.equal(true);
        }
      }
    ],
    invalid: [
      // use number with exponent value snbo
      {
        input: {
          number: 1.0000000000000006e+308
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      // use number with decimal places value snbo
      {
        input: {
          number: 123456789.987123456789
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      // use null value snbo
      {
        input: {
          number: null
        },
        validate: (output) => {
          expect(output).to.equal(null);
        }
      },
      // use empty string value snbo
      {
        input: {
          number: ''
        },
        validate: (output) => {
          expect(output).to.equal('');
        }
      },
      // use string value snbo
      {
        input: {
          number: 'abc'
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      // use string value snbo
      {
        input: {
          number: "new(require('bignumber.js'))()"
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      // use number value snbo
      {
        input: {
          number: 123
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      }
    ]
  },
  toBigNumber: {
    valid: [
      // use 1 digit number sbo
      {
        input: {
          number: 1
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      // use 1 digit number in string sbo
      {
        input: {
          number: '1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      // use hex string sbo
      {
        input: {
          number: '0x1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      // use hex string with leading 0 sbo
      {
        input: {
          number: '0x01'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      // use hex string sbo
      {
        input: {
          number: 15
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      // use 2 digit number in string format sbo
      {
        input: {
          number: '15'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      // use higher value of hex string sbo
      {
        input: {
          number: '0xf'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      // use big number value sbo
      {
        input: {
          number: new BigNumber('f', 16)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      // use minus 1 digit number sbo
      {
        input: {
          number: -1
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      // use minus 1 digit number in string format sbo
      {
        input: {
          number: '-1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      // use minus hex string sbo
      {
        input: {
          number: '-0x1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      // use minus hex string with leading zero sbo
      {
        input: {
          number: '-0x01'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      // use minus 2 digit number sbo
      {
        input: {
          number: -15
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      // use minus 2 digit number in string format sbo
      {
        input: {
          number: '-15'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      // use minus hex string higher value sbo
      {
        input: {
          number: '-0xf'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      // use minus hex string higher value with leading zero sbo
      {
        input: {
          number: '-0x0f'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      // use hex string with BIG value sbo
      {
        input: {
          number: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933)
        }
      },
      {
        input: {
          number: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639935)
        }
      },
      // use hex string with BIG value sbo
      {
        input: {
          number: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933)
        }
      },
      // use 0 value sbo
      {
        input: {
          number: 0
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use 0 value in string format sbo
      {
        input: {
          number: '0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use 0 value in hex string format sbo
      {
        input: {
          number: '0x0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use minus 0 value sbo
      {
        input: {
          number: -0
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      // use minus 0 value in string format sbo
      {
        input: {
          number: '-0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      // use minus 0 value in hex string sbo
      {
        input: {
          number: '-0x0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      // use big number 0 value sbo
      {
        input: {
          number: new BigNumber(0)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use big null value sbo
      {
        input: {
          number: null
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use undefined value sbo
      {
        input: {
          number: undefined
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use empty string value sbo
      {
        input: {
          number: ''
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      // use high number value sbo
      {
        input: {
          number: Math.pow(10, 308)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1.0000000000000006e+308)
        }
      }
    ],
    invalid: [
      // use invalid hex string snbo
      {
        input: {
          number: 'string'
        },
        validate: (output) => {
          expect(output.toString()).to.equal('NaN')
        }
      },
      // use BIG NUMBER++ snbo
      {
        input: {
          number: Math.pow(10, 309)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(Infinity)
        }
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window._commonTd = _commonTd;
}
else {
  module.exports = { _commonTd };
}