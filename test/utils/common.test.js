'use strict';

var Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var BigNumber = typeof window !== 'undefined' ? window.BigNumber : require('bignumber.js');
var glOrWd = (typeof window !== 'undefined' ? window : global);

describe('web4.utils.util', function () {
  const web4 = new Web4({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  it('should have "generateUuid" function', function () {
    expect(web4.utils.util.generateUuid).to.be.a('function');
  });

  it('should have "isBigNumber" function', function () {
    expect(web4.utils.util.isBigNumber).to.be.a('function');
  });

  it('should have "toBigNumber" function', function () {
    expect(web4.utils.util.toBigNumber).to.be.a('function');
  })

  it('"generateUuid" should return a string', function (done) {
    const test = {
      function: (data) => {
        return web4.utils.util.generateUuid(data.length);
      },
      validate: (output) => {
        expect(output).to.be.a('string');
        expect(output.length).to.equal(36);
      }
    };
    test.data = [
      {
        input: {}
      }
    ]
    glOrWd.runTest(test, done);
  });

  it('"isBigNumber" should return a boolean', function (done) {
    const test = {
      function: (data) => {
        return web4.utils.util.isBigNumber(data.number);
      },
      validate: (output) => {
        expect(output).to.be.a('boolean');
      }
    };
    test.data = [
      {
        input: { number: 123456789.987123456789 },
        validate: (output) => {
          expect(output).to.equal(false);
        }
      },
      {
        input: { number: new (require('bignumber.js'))() },
        validate: (output) => {
          expect(output).to.equal(true);
        }
      }
    ]
    glOrWd.runTest(test, done);
  });

  it('"toBigNumber" should return a big number based on given value', function (done) {
    const test = {
      function: (data) => {
        return web4.utils.util.toBigNumber(data.number);
      },
      validate: (output) => {
        expect(output instanceof BigNumber).to.equal(true);
      }
    };
    test.data = [
      {
        input: { number: 1 },
        validate: (output) => expect(output.toNumber()).to.equal(1)
      },
      {
        input: { number: '1' },
        validate: (output) => expect(output.toNumber()).to.equal(1)
      },
      {
        input: { number: '0x1' },
        validate: (output) => expect(output.toNumber()).to.equal(1)
      },
      {
        input: { number: '0x01' },
        validate: (output) => expect(output.toNumber()).to.equal(1)
      },
      {
        input: { number: 15 },
        validate: (output) => expect(output.toNumber()).to.equal(15)
      },
      {
        input: { number: '15' },
        validate: (output) => expect(output.toNumber()).to.equal(15)
      },
      {
        input: { number: '0xf' },
        validate: (output) => expect(output.toNumber()).to.equal(15)
      },
      {
        input: { number: new BigNumber('f', 16) },
        validate: (output) => expect(output.toNumber()).to.equal(15)
      },
      {
        input: { number: -1 },
        validate: (output) => expect(output.toNumber()).to.equal(-1)
      },
      {
        input: { number: '-1' },
        validate: (output) => expect(output.toNumber()).to.equal(-1)
      },
      {
        input: { number: '-0x1' },
        validate: (output) => expect(output.toNumber()).to.equal(-1)
      },
      {
        input: { number: '-0x01' },
        validate: (output) => expect(output.toNumber()).to.equal(-1)
      },
      {
        input: { number: -15 },
        validate: (output) => expect(output.toNumber()).to.equal(-15)
      },
      {
        input: { number: '-15' },
        validate: (output) => expect(output.toNumber()).to.equal(-15)
      },
      {
        input: { number: '-0xf' },
        validate: (output) => expect(output.toNumber()).to.equal(-15)
      },
      {
        input: { number: '-0x0f' },
        validate: (output) => expect(output.toNumber()).to.equal(-15)
      },
      {
        input: { number: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
        validate: (output) => expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639935)
      },
      {
        input: { number: '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd' },
        validate: (output) => expect(output.toNumber()).to.equal(115792089237316195423570985008687907853269984665640564039457584007913129639933)
      },
      {
        input: { number: '-0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
        validate: (output) => expect(output.toNumber()).to.equal(-115792089237316195423570985008687907853269984665640564039457584007913129639935)
      },
      {
        input: { number: '-0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd' },
        validate: (output) => expect(output.toNumber()).to.equal(-115792089237316195423570985008687907853269984665640564039457584007913129639933)
      },
      {
        input: { number: 0 },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: '0' },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: '0x0' },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: -0 },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: '-0' },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: '-0x0' },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
      {
        input: { number: new BigNumber(0) },
        validate: (output) => expect(output.toNumber()).to.equal(0)
      },
    ]
    glOrWd.runTest(test, done);
  });
});