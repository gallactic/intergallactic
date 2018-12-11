'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var Intergallactic = glOrWd.Intergallactic;
var expect = glOrWd.expect;
let txnTd = (typeof window !== 'undefined' ? window : require('./transaction.td'))._txnTd;

before('instantiate Intergallactic', () => {
  new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('Intergallactic.Transaction Positive Scenario', () => {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
  const newTxn = new igc.TransactionV2({ to: 'aaa', amount: 100 });

  it('should have "sign" function upon instantiate', () => {
    expect(newTxn.sign).to.be.a('function');
  });

  it('should have "send" function upon instantiate', () => {
    expect(newTxn.send).to.be.a('function');
  });

  it('should have "call" function upon instantiate', () => {
    expect(newTxn.call).to.be.a('function');
  });

  it('should have "bond" function upon instantiate', () => {
    expect(newTxn.bond).to.be.a('function');
  });

  it('should have "unbond" function upon instantiate', () => {
    expect(newTxn.unbond).to.be.a('function');
  });

  it('should have "permission" function upon instantiate', () => {
    expect(newTxn.permission).to.be.a('function');
  });

  it('"sign", should be able to sign the transaction', function (done) {
    const test = {
      function: (data) => {
        const txn = new igc.TransactionV2(data.txn);
        return txn.sign(data.pvK);
      },
      validate: (res) => {

      }
    };
    test.data = txnTd.sign.ok;
    glOrWd.runTest(test, done);
  });

  it('"signSync", should be able to sign the transaction synchoronously', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.signSync(data.pvK);
      },
      validate: (res) => {

      }
    };
    test.data = txnTd.signSync.ok;
    glOrWd.runTest(test, done);
  });

  it('"broadcast", should be able to broadcast transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.sign(data.pvK)
          .then(() => {
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
    };
    test.data = txnTd.broadcast.ok;
    glOrWd.runTest(test, done);
  });

  it('"send", should be able to broadcast "SEND" transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.send(data.pvK)
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };

    this.timeout(10000);
    test.data = txnTd.send.ok;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it.skip('"call", be able to broadcast "CALL" transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.call(data.pvK)
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };

    this.timeout(10000);
    test.data = txnTd.call.ok;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"bond", be able to broadcast "BOND" transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.bond(data.pvK)
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };

    this.timeout(10000);
    test.data = txnTd.bond.ok;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"unbond", be able to broadcast "UNBOND" transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.unbond(data.pvK)
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };

    this.timeout(10000);
    test.data = txnTd.unbond.ok;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });

  it('"permission", be able to broadcast "PERMISSION" transaction', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        return newTxn.permission(data.pvK)
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.error).to.equal(undefined);
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.TxHash).to.be.a('string');
        expect(res.body.result.TxHash.length).to.equal(28);
      }
    };

    this.timeout(10000);
    test.data = txnTd.permission.ok;
    setTimeout(function () { glOrWd.runTest(test, done) }, 2000);
  });
});

describe('Intergallactic.TransactionV2 Negative Scenario', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('multiple "sign", should not throw error', function (done) {
    const test = {
      function: (data) => {
        const txn = new igc.TransactionV2(data.txn);
        return txn.sign(data.pvK)
          .then(() => { return txn.sign(data.pvK) });
      },
      validate: (res) => {

      }
    };
    test.data = txnTd.sign.ok;
    glOrWd.runTest(test, done);
  });

  it('multiple "signSync", should not throw error', function (done) {
    const test = {
      function: (data) => {
        const newTxn = new igc.TransactionV2(data.txn);
        newTxn.signSync(data.pvK);
        return newTxn.signSync(data.pvK);
      },
      validate: (res) => {

      }
    };
    test.data = txnTd.signSync.ok;
    glOrWd.runTest(test, done);
  });
})