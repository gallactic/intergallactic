'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var expect = glOrWd.expect;
var BigNumber = glOrWd.BigNumber;

var errorMessage;
var _conversionTd = {};

// sbo, stands for "should be ok"
// snbo, stands for "should not be ok"
_conversionTd = {
  getUnitValue: {
    valid: [
      // boson is valid unit value, sbo
      {
        input: {
          unit: 'boson'
        },
        validate: (output) => {
          expect(output).to.equal(1)
        }
      },
      // gtx is valid unit value, sbo
      {
        input: {
          unit: 'gtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000000000)
        }
      },
      // gtx is valid unit value, sbo
      {
        input: {
          unit: 'teragtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000000000000000000000)
        }
      },
      // kboson is valid unit value, sbo
      {
        input: {
          unit: 'kboson'
        },
        validate: (output) => {
          expect(output).to.equal(1000)
        }
      },
      // kboson is valid unit value, sbo
      {
        input: {
          unit: 'femtogtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000)
        }
      },
      // mboson is valid unit value, sbo
      {
        input: {
          unit: 'mboson'
        },
        validate: (output) => {
          expect(output).to.equal(1000000)
        }
      },
      // picogtx is valid unit value, sbo
      {
        input: {
          unit: 'picogtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000)
        }
      },
      // gboson is valid unit value, sbo
      {
        input: {
          unit: 'gboson'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000)
        }
      },
      // nanogtx is valid unit value, sbo
      {
        input: {
          unit: 'nanogtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000)
        }
      },
      // nano is valid unit value, sbo
      {
        input: {
          unit: 'nano'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000)
        }
      },
      // microgtx is valid unit value, sbo
      {
        input: {
          unit: 'microgtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000)
        }
      },
      // micro is valid unit value, sbo
      {
        input: {
          unit: 'micro'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000)
        }
      },
      // milligtx is valid unit value, sbo
      {
        input: {
          unit: 'milligtx'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000000)
        }
      },
      // milli is valid unit value, sbo
      {
        input: {
          unit: 'milli'
        },
        validate: (output) => {
          expect(output).to.equal(1000000000000000)
        }
      },
      // kgtx is valid unit value, sbo
      {
        input: {
          unit: 'kgtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+21)
        }
      },
      // kilogtx is valid unit value, sbo
      {
        input: {
          unit: 'kilogtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+21)
        }
      },
      // grand is valid unit value, sbo
      {
        input: {
          unit: 'grand'
        },
        validate: (output) => {
          expect(output).to.equal(1e+21)
        }
      },
      // mgtx is valid unit value, sbo
      {
        input: {
          unit: 'mgtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+24)
        }
      },
      // megagtx is valid unit value, sbo
      {
        input: {
          unit: 'megagtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+24)
        }
      },
      // ggtx is valid unit value, sbo
      {
        input: {
          unit: 'ggtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+27)
        }
      },
      // gigagtx is valid unit value, sbo
      {
        input: {
          unit: 'gigagtx'
        },
        validate: (output) => {
          expect(output).to.equal(1e+27)
        }
      },
      // tgtx is valid unit value, sbo
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
      // 32 is invalid unit value, snbo
      {
        input: {
          unit: 32
        },
        validate: (output) => {
          errorMessage = 'Unit parameter is not a valid unit';
          expect(output.message).to.equal(errorMessage);
        }
      },
      // invalid unit value, snbo
      {
        input: {
          unit: ''
        },
        validate: (output) => {
          errorMessage = 'This unit currently not supported yet, please use one of the following boson,kboson,femtogtx,mboson,picogtx,gboson,nanogtx,nano,microgtx,micro,milligtx,milli,gtx,kgtx,kilogtx,grand,mgtx,megagtx,ggtx,gigagtx,tgtx,teragtx';
          expect(output.message).to.equal(errorMessage);
        }
      },
      // invalid unit value, snbo
      {
        input: {
          unit: undefined
        },
        validate: (output) => {
          expect(output.message).to.equal(undefined)
        }
      },
      // invalid unit value, snbo
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
      // invalid conversion value, snbo
      {
        input: {
          number: 'string'
        },
        validate: (output) => {
          expect(output.toString()).to.equal('NaN');
          expect(BigNumber.isBigNumber(output)).to.equal(true);
        }
      },
      // invalid conversion value, snbo
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
      // invalid conversion value, snbo
      {
        input: {
          unit: 'gtx'
        },
        validate: (output) => {
          expect(output.toNumber()).to.equal(0);
          expect(BigNumber.isBigNumber(output)).to.equal(true);
        }
      },
      // invalid conversion unit value, snbo
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
      // invalid conversion value and unit value, snbo
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
      // invalid conversion value and unit value, snbo
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
      // invalid conversion value, snbo
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
      // invalid conversion value, snbo
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
      // invalid conversion unit value, snbo
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
      }
    ],
    invalid: [
      // invalid conversion value, snbo
      {
        input: {
          number: 'string'
        },
        validate: (output) => {
          expect(output.toString()).to.equal('NaN');
          expect(BigNumber.isBigNumber(output)).to.equal(true);
        }
      },
      // invalid conversion value, snbo
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
      // invalid conversion unit value, snbo
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
      // invalid conversion value and unit value, snbo
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
      // invalid conversion value and unit value, snbo
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
      // invalid conversion value, snbo
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
      // invalid conversion value, snbo
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
      // invalid conversion unit value, snbo
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
};

if (typeof window !== 'undefined') {
  window._conversionTd = _conversionTd;
}
else {
  module.exports = { _conversionTd };
}