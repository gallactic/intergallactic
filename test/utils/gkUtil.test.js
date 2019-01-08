'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var Intergallactic = glOrWd.Intergallactic;
var expect = glOrWd.expect;

describe('igc.utils.gkUtil', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('should have "util" object', function () {
    expect(igc.utils.gkUtil.util).to.be.an('object');
  });

  it('should have "crypto" object', function () {
    expect(igc.utils.gkUtil.crypto).to.be.an('object');
  });

  it('should have "mnemonic" object', function () {
    expect(igc.utils.gkUtil.mnemonic).to.be.an('object');
  });
});