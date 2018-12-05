'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var Intergallactic = glOrWd.Intergallactic;
var expect = glOrWd.expect;

const testAcc = {
  address: 'acFVrNat8Y8Evid4fcJzN5KxyEAyuHS6Tuu',
  privKey: 'ski47BSAmY6PJ9KMHXHMzk7tG8nXTJaKKF2BTRPzmjJ3NAzy1HxMAz336JiN7N8KzF786T2mptHHbBY5fmFeoaNukokkF66',
  pubKey: 'pkCogxsiXdTj9yn62cXN6L5NHwcrBfS8N2bYhob4HTPDExJfWpD'
}
before('instantiate Intergallactic', function () {
  new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('Intergallactic.Transaction', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const newTxn = new igc.Transaction({}, { type: 1 });

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
        const newTxn = new igc.Transaction(data.txn, data.opt);
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
          chainId: 'test-chain-5bc7',
          sequence: 300
        },
        txn: {
          from: [{
            address: testAcc.address,
            amount: 10
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
          chainId: 'test-chain-5bc7',
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
        const newTxn = new igc.Transaction(data.txn, data.opt);
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
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
        const newTxn = new igc.Transaction(data.txn, data.option);
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
        option: {
          type: 1,
          unit: 'boson'
        },
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
    }]

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 0);
  });

  it.skip('"call", should call the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"bond", should bond the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
            amount: 200
          },
          to: {
            address: 'vaBdTQnKWstzbP9rrMCvPP4rxqLU3PDvKHM',
            amount: 100
          },
          publicKey: 'pjDvQc1rF8HhCAK8L8zu3SJQcKtCMroo1rmRWf8o8m111DexqzX'
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 2000);
  });

  it('"unbond", should unbond the given transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
        privKey: 'skWKMJw3ohL81ACUNFMEzVcfa9GrWyVyQC33FUeRNLSa1MMHshZVgLuxQQPCB8AyCfxZQh98HuLfvqG5zqtVawdnP237bpn',
        pubKey: 'pjDvQc1rF8HhCAK8L8zu3SJQcKtCMroo1rmRWf8o8m111DexqzX',
        txnType: 4,
        txn: {
          from: {
            // address: testAcc.address
            address: 'vaBdTQnKWstzbP9rrMCvPP4rxqLU3PDvKHM',
            amount: 200
          },
          to: {
            address: testAcc.address,
            amount: 100
          }
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 2000);
  });

  it('"permission", should do permission transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
            amount: 100
          },
          to: {
            address: 'acG9u2dcdu1kZoSEyxuGU7aWv3sHA8KNebo',
            amount: 0
          },
          permissions: '0x4',
          set: true
        }
      },
      validate: () => {

      }
    }];

    this.timeout(5000);
    setTimeout(function () { glOrWd.runTest(test, done); }, 2000);
  });

  it('"broadcast", should broadcast the transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
            amount: 10
          }],
          to: [{
            address: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
            amount: 10
          }]
        }
      }
    }];

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it.skip('"signNBroadcast", should broadcast the transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
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
            amount: 10
          },
          to: {
            address: '',
            amount: 10
          },
          gasLimit: 1,
          data: '010203' // currently require an input of byte array
        }
      }
    }]

    this.timeout(10000);
    setTimeout(function () { glOrWd.runTest(test, done) }, 5000);
  });

  it('doing multiple "signSync" should return signature without error', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, data.opt);
        newTxn.signSync(data.privKey);
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
          chainId: 'test-chain-5bc7',
          sequence: 300
        },
        txn: {
          from: [{
            address: testAcc.address,
            amount: 10
          }],
          to: [{
            address: 'acQUFGxsXVPSd6vbAceSkURnWhYhApE9VRe',
            amount: 10
          }]
        }
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('doing multiple "sign" should return signature without error', function (done){
    const test = {
      function: (data) => {
        const newTxn = new igc.Transaction(data.txn, { type: data.txnType });
        return newTxn.sign(data.privKey)
          .then(signature => {
            return newTxn.sign(data.privKey)
          });
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
    }]

    glOrWd.runTest(test, done);
  })
});