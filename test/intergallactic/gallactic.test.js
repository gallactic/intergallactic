'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);

before('instantiate IGC', function () {
  new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('Intergallactic.gltc', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('should have "getChainId" function', function () {
    expect(igc.gltc.getChainId).to.be.a('function');
  });

  it('should have "getInfo" function', function () {
    expect(igc.gltc.getInfo).to.be.a('function');
  });

  it('should have "getLatestBlock" function', function () {
    expect(igc.gltc.getLatestBlock).to.be.a('function');
  });

  it('should have "getBlock" function', function () {
    expect(igc.gltc.getBlock).to.be.a('function');
  });

  it('should have "getBlockTxns" function', function () {
    expect(igc.gltc.getBlockTxns).to.be.a('function');
  });

  it('"getChainId", should return chain info including ChainId', function (done) {
    const test = {
      function: (data) => {
        return igc.gltc.getChainId();
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.ChainName).to.be.a('string');
        expect(res.body.result.ChainId).to.be.a('string');
      }
    }

    test.data = [{
      input: {}
    }]

    glOrWd.runTest(test, done);
  });

  it('"getInfo", should return node information', function (done) {
    const test = {
      function: (data) => {
        return igc.gltc.getInfo();
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.result).to.be.an('object');
        expect(res.body.result.result.node_info).to.be.an('object');
        expect(res.body.result.result.latest_block_hash).to.be.a('string');
        expect(res.body.result.result.latest_app_hash).to.be.a('string');
        expect(res.body.result.result.latest_block_height).to.be.a('number');
        expect(res.body.result.result.latest_block_time).to.be.a('string');
        expect(res.body.result.NodeVersion).to.be.a('string');
      }
    }

    test.data = [{
      input: {}
    }]

    glOrWd.runTest(test, done);
  });

  it('"getLatestBlock", should return node info including latest block info', function (done) {
    const test = {
      function: (data) => {
        return igc.gltc.getLatestBlock();
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body.result).to.be.an('object', 'res.body.result');
        expect(res.body.result.BlockMeta).to.be.an('object');
        expect(res.body.result.Block).to.be.an('object');
      }
    }

    test.data = [{
      input: {}
    }]

    glOrWd.runTest(test, done);
  });

  it('"getBlock", should return block info given a block height', function (done) {
    const test = {
      // before: (data) => {
      //   return igc.gltc.getLatestBlock()
      //     .then(res => {
      //       data.height = res.body.result.Block.header.height;
      //     });
      // },
      function: (data) => {
        return igc.gltc.getBlock(data.height);
      },
      validate: (res, input) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.BlockMeta).to.be.an('object');
        expect(res.body.result.Block.header.height)
          .to.equal(input.height.toString());
      }
    }

    test.data = [{
      input: {
        height: 5
      }
    }, {
      input: {
        height: 1
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"getBlockTxns", should return list of block transactions', function (done) {
    const test = {
      // before: (data) => {
      //   return igc.gltc.getInfo()
      //     .then(res => {
      //       data.height = res.body.result.Block.header.height;
      //     });
      // },
      function: (data) => {
        return igc.gltc.getBlockTxns(data.height);
      },
      validate: (res, input) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        // expect(res.body.result.ResultBlock).to.be.an('object');
        // expect(res.body.result.ResultBlock.block_meta.header.height)
        //   .to.equal(input.height);
      }
    }

    test.data = [{
      input: {
        height: 5
      }
    }]

    glOrWd.runTest(test, done);
  });
});