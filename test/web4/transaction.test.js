'use strict';

const Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
const expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;

const testAcc = {
  address: '406894F316F95DC83BFD2F6418BE0CC31C3163A0',
  privKey: 'B3F4AE2C242ACEE2374C49990DD196361A88B25EDA473947A381830B3B4D418F2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF',
  pubKey: '2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF'
}
before('instantiate web4', function () {
  new Web4({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });
});

describe('Web4.Txn', function () {
  const web4 = new Web4({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });
  const newTxn = new web4.Txn({}, { type: 1 });

  it('should have "Web4" object upon instantiate', function () {
    expect(newTxn.Web4).to.be.an('object');
  })

  it('should have "sign" function upon instantiate', function () {
    expect(newTxn.sign).to.be.a('function');
  });

  it('should have "send" function upon instantiate', function () {
    expect(newTxn.send).to.be.a('function');
  });

  it('should have "signNSend" function upon instantiate', function () {
    expect(newTxn.sign).to.be.a('function');
  });

  it('should have "call" function upon instantiate', function () {
    expect(newTxn.send).to.be.a('function');
  });

  it('should have "signNCall" function upon instantiate', function () {
    expect(newTxn.send).to.be.a('function');
  });

  it('"sign",should sign the transaction based and return the signed transaction object', function (done) {
    const test = {
      function: function (data) {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey);
      },
      validate: function (res) {
        expect(res).to.be.a('string');
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        txnType: 1,
        txn: {
          inputs: [{
            address: testAcc.address,
            amount: 10
          }],
          outputs: [{
            address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B',
            amount: 10
          }]
        }
      }
    }, {
      input: {
        privKey: testAcc.privKey,
        txnType: 2,
        txn: {
          address: testAcc.address,
          data: {},
          fee: 1,
          gas_limit: 1,

          input: {
            address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B', // source address
            amount: 1
          }
        }
      }
    }]

    global.runTest(test, done);
  });

  it.skip('"send", should send the transaction', function (done) {
    const test = {
      function: function (data) {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            return newTxn.send(signature, data.pubKey);
          });
      },
      validate: function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(40);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        pubKey: testAcc.pubKey,
        txnType: 1,
        txn: {
          inputs: [{
            address: testAcc.address,
            amount: 10
          }],
          outputs: [{
            address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B',
            amount: 10
          }]
        }
      }
    }]

    global.runTest(test, done)
  });

  it.skip('"signNSend", should sign the transaction and do send process', function (done) {
    const test = {
      function: function (data) {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.signNSend(data.privateKey);
      },
      validate: function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(40);
      }
    };
    test.data = [{
      input: {
        privateKey: testAcc.privKey,
        txnType: 1,
        txn: {
          inputs: [{
            address: testAcc.address,
            amount: 10
          }],
          outputs: [{
            address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B',
            amount: 10
          }]
        }
      }
    }]

    global.runTest(test, done);
  });

  it.skip('"call", should call the given transaction', function (done) {
    const test = {
      function: function (data) {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            return newTxn.call(signature, data.pubKey);
          });
      },
      validate: function (res) {
        console.log(res);
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(40);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        pubKey: testAcc.pubKey,
        txnType: 2,
        txn: {
          address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B',
          amount: 10,
          data: {},
          fee: 1,
          gas_limit: 1,
          input: {
            address: testAcc.address,
            amount: 10
          }
        }
      }
    }];
    global.runTest(test, done);
  });

  it.skip('"signNCall", should sign the transaction and do send process', function (done) {
    const test = {
      function: function (data) {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.signNCall(data.privKey);
      },
      validate: function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(40);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        txnType: 2,
        txn: {
          address: '008AEEDA4D805471DF9B2A5B0F38A0C3BCBA786B',
          amount: 10,
          data: {},
          fee: 1,
          gas_limit: 1,
          input: {
            address: testAcc.address,
            amount: 10
          }
        }
      }
    }]

    global.runTest(test, done);
  });
});