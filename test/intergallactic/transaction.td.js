'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var expect = glOrWd.expect;
var BigNumber = glOrWd.BigNumber;

var errorMessage;
var _txnTd = {};

var testAcc = glOrWd.testAcc;

_txnTd.sign = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10,
        type: 1
      }
    }
  }, {
    input: {
      pvK: testAcc.privKey,
      txn: {
        from: testAcc.address,
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10,
        type: 1
      }
    }
  }, {
    input: {
      pvK: [testAcc.privKey, testAcc.privKey],
      txn: {
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10,
        type: 1
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.signSync = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        from: testAcc.address,
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10,
        type: 1,
        chainId: 'test-1f03-a9fj',
        sequence: 10
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.broadcast = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        chainId: 'test-1f03-a9fj',
        from: testAcc.address,
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10,
        type: 1
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.send = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: 'acWmVcNrHzxBF8L25vdiKLsz664ZGkYmPRj',
        amount: 10
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.call = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: '',
        gasLimit: 1,
        amount: 0,
        data: '010203' // currently require an input of byte array
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.bond = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: 'vaJDp96jHwKrYQ4Kz3jbbgBK8bxUhSfTwvb',
        amount: 200,
        publicKey: testAcc.pubKey
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.unbond = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: testAcc.address,
        amount: 200
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
};

_txnTd.permission = {
  ok: [{
    input: {
      pvK: testAcc.privKey,
      txn: {
        to: testAcc.address,
        amount: 0,
        permissions: '0x4',
        set: true
      }
    }
  }],
  notOk: [{
    // TODO: Negative test case
  }]
}

if (typeof window !== 'undefined') {
  window._txnTd = _txnTd;
}
else {
  module.exports = { _txnTd };
}