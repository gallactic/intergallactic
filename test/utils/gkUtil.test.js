'use strict';

var Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var globalOrWindow = (typeof window !== 'undefined' ? window : global);

describe('web4.utils.gkUtil', function () {
  const web4 = new Web4({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });

  it('should have util object', function () {
    expect(web4.utils.gkUtil.util).to.be.an('object');
  });

  it('should have crypto object', function () {
    expect(web4.utils.gkUtil.crypto).to.be.an('object');
  });

  it('should have util object', function () {
    expect(web4.utils.gkUtil.mnemonic).to.be.an('object');
  });
});