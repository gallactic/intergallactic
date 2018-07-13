'use strict';

const Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
const expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;

before('instantiate web4', function () {
  new Web4({ url: 'http://167.99.28.239', protocol: 'jsonrpc' });
});

describe('Web4.account', function () {
  const web4 = new Web4({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });

  it('should have "listAccounts" func', function () {
    expect(web4.account.listAccounts).to.be.a('function');
  });

  it('should have "getAccount" func', function () {
    expect(web4.account.getAccount).to.be.a('function');
  });

  it('should have "getStorage" func', function () {
    expect(web4.account.getStorage).to.be.a('function');
  });

  it('should have "getStorageAt" func', function () {
    expect(web4.account.getStorageAt).to.be.a('function');
  });

  it('"listAccounts", should return account details', function (done) {
    var test = [{
      input: {},
      output: {}
    }];

    recursiveTest();

    function recursiveTest(count = 0) {
      if (test.length === count) {
        return done();
      }
      web4.account.listAccounts(test[count].input.address)
        .then(res => {
          return res;
        })
        .catch(err => {
          return { err: err };
        })
        .then(data => {
          expect(data.err).to.equal(undefined);
          expect(data.body).to.be.an('object');
          expect(data.body.result).to.be.an('object');
          expect(data.body.result.BlockHeight).to.be.a('number');
          expect(data.body.result.Accounts).to.be.an('array');
          recursiveTest(++count);
        })
    }
  });

  it('"getAccount", should return account details', function (done) {
    var test = [{
      input: {
        address: '4B1207BBB80CDE31C155CB3C5EABE9DBC3E0EAC2'
      },
      validate: function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.Account).to.be.an('object');
        expect(res.body.result.Account.Address).to.equal('4B1207BBB80CDE31C155CB3C5EABE9DBC3E0EAC2');
      }
    }];

    recursiveTest();

    function recursiveTest(count = 0) {
      if (test.length === count) {
        return done();
      }

      web4.account.getAccount(test[count].input.address)
        .then(res => {
          test[count].validate(res);
          recursiveTest(++count);
        })
        .catch(done);
    }
  });

  it('"getStorage", should return storage details', function (done) {
    var test = [{
      input: {
        address: 'F67B603188441B53AD8C073E121CA1FF724230EF'
      },
      validate: function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.StorageRoot).to.equal('<should_have_a_value_here>');
        expect(res.body.result.StorageItems).to.eql([]);
      }
    }];

    recursiveTest();

    function recursiveTest(count = 0) {
      if (test.length === count) {
        return done();
      }

      web4.account.getStorage(test[count].input.address)
        .then(res => {
          test[count].validate(res);
          recursiveTest(++count);
        })
        .catch(done);
    }
  });

  it('"getStorageAt", should return storage details', function (done) {
    const test = {
      function: function (data) {
        return web4.account.getStorageAt(data.address, data.key);
      }
    };
    test.data = [{
      input: {
        address: 'F67B603188441B53AD8C073E121CA1FF724230EF',
        key: 'greeting'
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object', 'result');
      }
    }]

    global.recursiveTest(test, 0, done);
  });
});