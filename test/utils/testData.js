'use strict';

var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);
var BigNumber = typeof window !== 'undefined' ? window.BigNumber : require('bignumber.js');

let errorMessage;

(typeof window !== 'undefined' ? window : module.exports).utilTestData = {
  commonTest: {
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
  },
  conversionTest: {
    getUnitValue: {
      valid: [
        {
          input: {
            unit: 'boson'
          },
          validate: (output) => {
            expect(output).to.equal(1)
          }
        },
        {
          input: {
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000000000)
          }
        },
        {
          input: {
            unit: 'teragtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000000000000000000000)
          }
        },
        {
          input: {
            unit: 'kboson'
          },
          validate: (output) => {
            expect(output).to.equal(1000)
          }
        },
        {
          input: {
            unit: 'femtogtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000)
          }
        },
        {
          input: {
            unit: 'mboson'
          },
          validate: (output) => {
            expect(output).to.equal(1000000)
          }
        },
        {
          input: {
            unit: 'picogtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000)
          }
        },
        {
          input: {
            unit: 'gboson'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000)
          }
        },
        {
          input: {
            unit: 'nanogtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000)
          }
        },
        {
          input: {
            unit: 'nano'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000)
          }
        },
        {
          input: {
            unit: 'microgtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000)
          }
        },
        {
          input: {
            unit: 'micro'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000)
          }
        },
        {
          input: {
            unit: 'milligtx'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000000)
          }
        },
        {
          input: {
            unit: 'milli'
          },
          validate: (output) => {
            expect(output).to.equal(1000000000000000)
          }
        },
        {
          input: {
            unit: 'kgtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+21)
          }
        },
        {
          input: {
            unit: 'kilogtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+21)
          }
        },
        {
          input: {
            unit: 'grand'
          },
          validate: (output) => {
            expect(output).to.equal(1e+21)
          }
        },
        {
          input: {
            unit: 'mgtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+24)
          }
        },
        {
          input: {
            unit: 'megagtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+24)
          }
        },
        {
          input: {
            unit: 'ggtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+27)
          }
        },
        {
          input: {
            unit: 'gigagtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+27)
          }
        },
        {
          input: {
            unit: 'tgtx'
          },
          validate: (output) => {
            expect(output).to.equal(1e+30)
          }
        }
      ],
      invalid: [
        // where the unit is not defined
        {
          input: {
            unit: 32
          },
          validate: (output) => {
            errorMessage = 'Unit parameter is not a valid unit';
            expect(output.message).to.equal(errorMessage);
          }
        },
        {
          input: {
            unit: ''
          },
          validate: (output) => {
            errorMessage = 'This unit currently not supported yet, please use one of the following boson,kboson,femtogtx,mboson,picogtx,gboson,nanogtx,nano,microgtx,micro,milligtx,milli,gtx,kgtx,kilogtx,grand,mgtx,megagtx,ggtx,gigagtx,tgtx,teragtx';
            expect(output.message).to.equal(errorMessage);
          }
        },
        {
          input: {
            unit: undefined
          },
          validate: (output) => {
            expect(output.message).to.equal(undefined)
          }
        },
        {
          input: {
            unit: 'string'
          },
          validate: (output) => {
            errorMessage = 'This unit currently not supported yet, please use one of the following boson,kboson,femtogtx,mboson,picogtx,gboson,nanogtx,nano,microgtx,micro,milligtx,milli,gtx,kgtx,kilogtx,grand,mgtx,megagtx,ggtx,gigagtx,tgtx,teragtx';
            expect(output.message).to.equal(errorMessage);
          }
        }
      ]
    },
    fromBoson: {
      valid: [
        // input with number value
        {
          input: {
            number: 1000000000000000000,
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1);
          }
        },
        // input with hex string value
        {
          input: {
            number: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933 / 1000000000000000000);
          }
        },
        // input with string value and minus
        {
          input: {
            number: '-15',
            unit: 'kboson'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(-(15 / 1000));
          }
        },
        // input without unit value, by default should convert to "gtx"
        {
          input: {
            number: '1000000000000000000'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1);
          }
        },
        {
          input: {
            number: undefined
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
          }
        },
        {
          input: {
            number: null
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
          }
        },
        {
          input: {
            number: ''
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
          }
        },
        {
          input: {
            number: 0
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
          }
        },
        // should give 0 value of big number with undefined number & unit param
        {
          input: {
            number: undefined,
            unit: undefined
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        }
      ],
      invalid: [
        {
          input: {
            number: 'string'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: 'string',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: 1000000000000000000,
            unit: 'string'
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: '',
            unit: ''
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: 'string',
            unit: 'string'
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        // invalid unit value, must throw an error
        {
          input: {
            number: 0,
            unit: 32
          },
          validate: (output) => {
            errorMessage = 'Unit parameter is not a valid unit';
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: '00x0f',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: '0x0F.F.F',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: '0x0F',
            unit: 'gtxx'
          },
          validate: (output) => {
            errorMessage = 'This unit currently not supported yet, please use one of the following boson,kboson,femtogtx,mboson,picogtx,gboson,nanogtx,nano,microgtx,micro,milligtx,milli,gtx,kgtx,kilogtx,grand,mgtx,megagtx,ggtx,gigagtx,tgtx,teragtx';
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        }
      ]
    },
    toBoson: {
      valid: [
        {
          input: {
            number: 1,
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1000000000000000000);
          }
        },
        {
          input: {
            number: '1',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1000000000000000000);
          }
        },
        {
          input: {
            number: '0x1',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1000000000000000000);
          }
        },
        // input without unit value, by default should convert from "gtx"
        {
          input: {
            number: 1
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(1000000000000000000);
          }
        },
        // should give 0 value of big number with undefined number & unit param
        {
          input: {
            number: undefined,
            unit: undefined
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
      ],
      invalid: [
        {
          input: {
            number: 'string'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: 'string',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toNumber()).to.equal(0);
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: 1000000000000000000,
            unit: 'string'
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: '',
            unit: ''
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: 'string',
            unit: 'string'
          },
          validate: (output) => {
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        // invalid unit value, must throw an error
        {
          input: {
            number: 0,
            unit: 32
          },
          validate: (output) => {
            errorMessage = 'Unit parameter is not a valid unit';
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        },
        {
          input: {
            number: '00x0f',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: '0x0F.F.F',
            unit: 'gtx'
          },
          validate: (output) => {
            expect(output.toString()).to.equal('NaN');
            expect(BigNumber.isBigNumber(output)).to.equal(true);
          }
        },
        {
          input: {
            number: '0x0F',
            unit: 'gtxx'
          },
          validate: (output) => {
            errorMessage = 'This unit currently not supported yet, please use one of the following boson,kboson,femtogtx,mboson,picogtx,gboson,nanogtx,nano,microgtx,micro,milligtx,milli,gtx,kgtx,kilogtx,grand,mgtx,megagtx,ggtx,gigagtx,tgtx,teragtx';
            expect(output.message).to.equal(errorMessage);
            expect(BigNumber.isBigNumber(output)).to.equal(false);
          }
        }
      ]
    }
  }
}