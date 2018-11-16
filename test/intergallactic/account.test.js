'use strict';

var glOrWd = (typeof window !== 'undefined' ? window : global);
var Intergallactic = glOrWd.Intergallactic;
var expect = glOrWd.expect;

before('instantiate Intergallactic', function () {
  new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });
});

describe('igc.account', function () {
  const igc = new Intergallactic({ url: glOrWd.tnet, protocol: 'jsonrpc' });

  it('should have "listAccounts" func', function () {
    expect(igc.account.listAccounts).to.be.a('function');
  });

  it('should have "getAccount" func', function () {
    expect(igc.account.getAccount).to.be.a('function');
  });

  it('should have "getStorage" func', function () {
    expect(igc.account.getStorage).to.be.a('function');
  });

  it('should have "getStorageAt" func', function () {
    expect(igc.account.getStorageAt).to.be.a('function');
  });

  it('"listAccounts", should return account details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.listAccounts(data.address)
      },
      validate: function (res) {
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.BlockHeight).to.be.a('number');
        expect(res.body.result.Accounts).to.be.an('array');
      }
    }
    test.data = [{
      input: {}
    }]

    glOrWd.runTest(test, done);
  });

  it('"getAccount", should return account details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.getAccount(data.address);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.Account).to.be.an('object');
      }
    };

    test.data = [{
      input: {
        address: 'acFbhUU8JK8mPhwYqMwy1DRrKP8fwUwnQMY'
      },
      validate: (res) => {
        expect(res.body.result.Account.address).to.equal('acFbhUU8JK8mPhwYqMwy1DRrKP8fwUwnQMY');
      }
    }, {
      input: {
        address: 'acLmQjWRZ4XmNZ7QfydbymbKKDYRSunkTua'
      },
      validate: (res) => {
        expect(res.body.result.Account.address).to.equal('acLmQjWRZ4XmNZ7QfydbymbKKDYRSunkTua');
      }
    }],

    glOrWd.runTest(test, done);
  });

  it('"getStorage", should return storage details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.getStorage(data.address);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.StorageRoot).to.equal('<should_have_a_value_here>');
        expect(res.body.result.StorageItems).to.eql([]);
      }
    };
    test.data = [{
      input: {
        address: 'acLmQjWRZ4XmNZ7QfydbymbKKDYRSunkTua'
      }
    }]

    glOrWd.runTest(test, done);
  });

  it('"getStorageAt", should return storage details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.getStorageAt(data.address, data.key);
      },
      validate: (res) => {
        expect(res.body.error, 'response error').to.equal(undefined);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object', 'response result');
      }
    };
    test.data = [{
      input: {
        address: 'acLmQjWRZ4XmNZ7QfydbymbKKDYRSunkTua',
        key: 'greeting'
      }
    }]

    glOrWd.runTest(test, done);
  });
});