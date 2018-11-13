'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var expect = glOrWd.expect;
var BigNumber = glOrWd.BigNumber;

var errorMessage;
var _commonTd = {};

_commonTd = {
  isBigNumber: {
    valid: [
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
      {
        input: {
          number: 1.0000000000000006e+308
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      {
        input: {
          number: 123456789.987123456789
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      {
        input: {
          number: null
        },
        validate: (output) => {
          expect(output).to.equal(null);
        }
      },
      {
        input: {
          number: ''
        },
        validate: (output) => {
          expect(output).to.equal('');
        }
      },
      {
        input: {
          number: 'abc'
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      {
        input: {
          number: "new(require('bignumber.js'))()"
        },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
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
      {
        input: {
          number: 1
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      {
        input: {
          number: '1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      {
        input: {
          number: '0x1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      {
        input: {
          number: '0x01'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(1)
        }
      },
      {
        input: {
          number: 15
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      {
        input: {
          number: '15'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      {
        input: {
          number: '0xf'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      {
        input: {
          number: new BigNumber('f', 16)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(15)
        }
      },
      {
        input: {
          number: -1
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      {
        input: {
          number: '-1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      {
        input: {
          number: '-0x1'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      {
        input: {
          number: '-0x01'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-1)
        }
      },
      {
        input: {
          number: -15
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      {
        input: {
          number: '-15'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      {
        input: {
          number: '-0xf'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
      {
        input: {
          number: '-0x0f'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-15)
        }
      },
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
      {
        input: {
          number: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933)
        }
      },
      {
        input: {
          number: 0
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: '0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: '0x0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: -0
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      {
        input: {
          number: '-0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      {
        input: {
          number: '-0x0'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(-0)
        }
      },
      {
        input: {
          number: new BigNumber(0)
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: null
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: undefined
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
      {
        input: {
          number: ''
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0)
        }
      },
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
      {
        input: {
          number: 'string'
        },
        validate: (output) => {
          expect(output.toString()).to.equal('NaN')
        }
      },
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