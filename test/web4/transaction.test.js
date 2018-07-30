'use strict';

var Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);

const testAcc = {
  address: 'acFbhUU8JK8mPhwYqMwy1DRrKP8fwUwnQMY',
  privKey: 'B3F4AE2C242ACEE2374C49990DD196361A88B25EDA473947A381830B3B4D418F2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF',
  pubKey: '2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF'
}
before('instantiate web4', function () {
  new Web4({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('Web4.Txn', function () {
  const web4 = new Web4({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const newTxn = new web4.Txn({}, { type: 1 });

  it('should have "signSync" function upon instantiate', function () {
    expect(newTxn.signSync).to.be.a('function');
  });

  it('should have "sign" function upon instantiate', function () {
    expect(newTxn.sign).to.be.a('function');
  });

  it('should have "send" function upon instantiate', function () {
    expect(newTxn.send).to.be.a('function');
  });

  it('should have "signNSend" function upon instantiate', function () {
    expect(newTxn.signNSend).to.be.a('function');
  });

  it('should have "call" function upon instantiate', function () {
    expect(newTxn.call).to.be.a('function');
  });

  it('should have "signNCall" function upon instantiate', function () {
    expect(newTxn.signNCall).to.be.a('function');
  });

  it('"signSync", should sign the transaction and return the signed transaction object synchronously', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, data.opt);
        return newTxn.signSync(data.privKey);
      },
      validate: (res) => {
        expect(res).to.be.a('string');
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        opt: {
          type: 1,
          chainId: 'Gallactica-Chain88291',
          sequence: 300
        },
        txn: {
          senders: [{
            address: testAcc.address,
            amount: 10
          }],
          receivers: [{
            address: 'acQUFGxsXVPSd6vbAceSkURnWhYhApE9VRe',
            amount: 10
          }]
        }
      }
    }, {
      input: {
        privKey: testAcc.privKey,
        opt: {
          type: 2,
          chainId: 'Gallactica-Chain88291',
          sequence: 300
        },
        txn: {
          caller: {
            address: testAcc.address,
            amount: 10
          },
          callee: {
            address: '',
            amount: 10
          },
          gasLimit: 1,
          data: '010203'
        }
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"signSync", should throw an error upon signing synchronously without chainId and sequence input', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, data.opt);
        try {
          newTxn.signSync(data.privKey);
        } catch (e) {
          return Promise.resolve(e);
        }
      },
      validate: (res) => {
        expect(res.message).to.equal('Chain id or sequence is not defined. Synchronous sign require chainId and sequence as parameter upon instantiate');
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        opt: {
          type: 1
        },
        txn: {}
      }
    }, {
      input: {
        privKey: testAcc.privKey,
        opt: {
          type: 2
        },
        txn: {}
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"sign",should sign the transaction and return the signed transaction object', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey);
      },
      validate: (res) => {
        expect(res).to.be.a('string');
      }
    };
    test.data = [{
      // send transaction data
      input: {
        privKey: testAcc.privKey,
        txnType: 1,
        txn: {
          senders: [{
            address: testAcc.address,
            amount: 10
          }],
          receivers: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10
          }]
        }
      }
    }, {
      // call transaction data
      input: {
        privKey: testAcc.privKey,
        txnType: 2,
        txn: {
          caller: {
            address: testAcc.address,
            amount: 10
          },
          callee: {
            address: '',
            amount: 10
          },
          gasLimit: 1,
          data: '010203'
        }
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"send", should send the transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            const signatories = [{
              signature, publicKey: data.pubKey
            }]
            return newTxn.send(signatories);
          });
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        pubKey: testAcc.pubKey,
        txnType: 1,
        txn: {
          senders: [{
            address: testAcc.address,
            amount: 10
          }],
          receivers: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10
          }]
        }
      }
    }]

    glOrWd.runTest(test, done)
  });

  it('"signNSend", should sign the transaction and do send process', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.signNSend(data.privateKey);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };
    test.data = [{
      input: {
        privateKey: testAcc.privKey,
        txnType: 1,
        txn: {
          senders: [{
            address: testAcc.address,
            amount: 10
          }],
          receivers: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10
          }]
        }
      }
    }]

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"call", should call the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            const signatories = [{
              signature, publicKey: data.pubKey
            }]
            return newTxn.call(signatories);
          });
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        pubKey: testAcc.pubKey,
        txnType: 2,
        txn: {
          caller: {
            address: testAcc.address,
            amount: 10
          },
          callee: {
            address: '',
            amount: 10
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }];
    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"signNCall", should sign the transaction and do send process', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new web4.Txn(data.txn, { type: data.txnType });
        return newTxn.signNCall(data.privKey);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        txnType: 2,
        txn: {
          caller: {
            address: testAcc.address,
            amount: 10
          },
          callee: {
            address: '',
            amount: 10
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }]

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });
});