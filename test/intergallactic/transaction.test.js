'use strict';

var Intergallactic = typeof window !== 'undefined' ? window.Intergallactic : require('../../index');
var expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;
var glOrWd = (typeof window !== 'undefined' ? window : global);

const testAcc = {
  address: 'acFbhUU8JK8mPhwYqMwy1DRrKP8fwUwnQMY',
  privKey: 'B3F4AE2C242ACEE2374C49990DD196361A88B25EDA473947A381830B3B4D418F2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF',
  pubKey: '2D47D0F43B27C57815E3317624742468D929544DF142ABA49AFFD9E00C8B1FCF'
}
before('instantiate IGC', function () {
  new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('Intergallactic.Txn', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const newTxn = new igc.Txn({}, { type: 1 });

  it('should have "signSync" function upon instantiate', function () {
    expect(newTxn.signSync).to.be.a('function');
  });

  it('should have "sign" function upon instantiate', function () {
    expect(newTxn.sign).to.be.a('function');
  });

  it('should have "signNBroadcast" function upon instantiate', function () {
    expect(newTxn.signNBroadcast).to.be.a('function');
  })

  it('should have "send" function upon instantiate', function () {
    expect(newTxn.send).to.be.a('function');
  });

  it('should have "call" function upon instantiate', function () {
    expect(newTxn.call).to.be.a('function');
  });

  it('should have "bond" function upon instantiate', function () {
    expect(newTxn.bond).to.be.a('function');
  });

  it('should have "unbond" function upon instantiate', function () {
    expect(newTxn.unbond).to.be.a('function');
  });

  it('should have "permission" function upon instantiate', function () {
    expect(newTxn.permission).to.be.a('function');
  });

  it('"signSync", should sign the transaction and return the signed transaction object synchronously', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, data.opt);
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
          from: [{
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          }],
          to: [{
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
          from: {
            address: testAcc.address,
            amount: 10
          },
          to: {
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
        const newTxn = new igc.Txn(data.txn, data.opt);
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
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
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
          from: [{
            address: testAcc.address,
            amount: 10
          }],
          to: [{
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
          from: {
            address: testAcc.address,
            amount: 10
          },
          to: {
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
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
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
          from: [{
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          }],
          to: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10,
            unit: 'boson'
          }]
        }
      }
    }]

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it('"call", should call the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
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
          from: {
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          },
          to: {
            address: '',
            amount: 10,
            unit: 'boson'
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }];
    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it.skip('"bond", should bond the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            const signatories = [{
              signature, publicKey: data.pubKey
            }];
            return newTxn.bond(signatories);
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
        txnType: 3,
        txn: {
          from: {
            address: testAcc.address,
            amount: 200,
            unit: 'boson'
          },
          to: {
            address: 'vaUjHHvCLmUzbzrz7xgF266xZEDvRa6RSDC',
            amount: 100,
            unit: 'boson'
          },
          publicKey: 'd67a7f69cfecfbacfa45046942191b310dc4ff1f9e8bf71de565949fc72af373'
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 5000);
  });

  it.skip('"unbond", should unbond the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            const signatories = [{
              signature, publicKey: data.pubKey
            }];
            return newTxn.unbond(signatories);
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
        // privKey: testAcc.privKey,
        // pubKey: testAcc.pubKey,
        privKey: '0A0766C934FAFE80E73A088B25406291AA6959B34446D82D2DD698C88100EDD9BD9E00FA32C8D1826EA4436F3817F800D201E0756A14735C4D2F72F30D11B1BE',
        pubKey: 'BD9E00FA32C8D1826EA4436F3817F800D201E0756A14735C4D2F72F30D11B1BE',
        txnType: 4,
        txn: {
          from: {
            // address: testAcc.address
            address: 'vaSe5zgueCAdo4VRKf9wtMnp73GmMpFQpRM',
            amount: 200,
            unit: 'boson'
          },
          to: {
            address: testAcc.address,
            amount: 100,
            unit: 'boson'
          }
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 5000);
  });

  it.skip('"permission", should do permission transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            const signatories = [{
              signature, publicKey: data.pubKey
            }];
            return newTxn.permission(signatories);
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
        txnType: 5,
        txn: {
          from: {
            address: testAcc.address,
            amount: 100,
            unit: 'boson'
          },
          to: {
            address: 'acUGqVmMzbD6SNkbTevqjGhfnXwckAZL9Lm',
            amount: 0,
            unit: 'boson'
          },
          permissions: '0x4',
          set: true
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 3000);
  });

  it('"broadcast", should broadcast the transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            newTxn.signatories = [{ signature, publicKey: data.pubKey }];

            return newTxn.broadcast();
          })
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    }
    test.data = [{
      input: {
        privKey: testAcc.privKey,
        pubKey: testAcc.pubKey,
        txnType: 1,
        txn: {
          from: [{
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          }],
          to: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10,
            unit: 'boson'
          }]
        }
      }
    }];

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it('"signNBroadcast", should broadcast the transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.signNBroadcast(data.privKey);
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
          from: {
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          },
          to: {
            address: '',
            amount: 10,
            unit: 'boson'
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }]

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });




  it.skip('DEPRECATED: "signNCall", should sign the transaction and do send process', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
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
          from: {
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          },
          to: {
            address: '',
            amount: 10,
            unit: 'boson'
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }]

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it.skip('DEPRECATED: "signNSend", should sign the transaction and do send process', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Txn(data.txn, { type: data.txnType });
        return newTxn.signNSend(data.privKey);
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
        txnType: 1,
        txn: {
          from: [{
            address: testAcc.address,
            amount: 10,
            unit: 'boson'
          }],
          to: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10,
            unit: 'boson'
          }]
        }
      }
    }]

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });
});