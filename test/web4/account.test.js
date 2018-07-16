'use strict';

const Web4 = typeof window !== 'undefined' ? window.Web4 : require('../../index');
const expect = typeof window !== 'undefined' ? window.expect : require('chai').expect;

before('instantiate web4', function () {
  new Web4({ url: 'http://54.95.41.253:1337/rpc', protocol: 'jsonrpc' });
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
    const test = {
      function: function (data) {
        return web4.account.listAccounts(data.address)
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

    global.recursiveTest(test, done);
  });

  it('"getAccount", should return account details', function (done) {
    const test = {
      function: function (data) {
        return web4.account.getAccount(data.address);
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
        address: '4B1207BBB80CDE31C155CB3C5EABE9DBC3E0EAC2'
      },
      validate: (res) => {
        expect(res.body.result.Account.Address).to.equal('4B1207BBB80CDE31C155CB3C5EABE9DBC3E0EAC2');
      }
    }, {
      input: {
        address: 'F67B603188441B53AD8C073E121CA1FF724230EF'
      },
      validate: (res) => {
        expect(res.body.result.Account.Address).to.equal('F67B603188441B53AD8C073E121CA1FF724230EF');
      }
    }],

    global.recursiveTest(test, done);
  });

  it('"getStorage", should return storage details', function (done) {
    const test = {
      function: function (data) {
        return web4.account.getStorage(data.address);
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
        address: 'F67B603188441B53AD8C073E121CA1FF724230EF'
      }
    }]

    global.recursiveTest(test, done);
  });

  it('"getStorageAt", should return storage details', function (done) {
    const test = {
      function: function (data) {
        return web4.account.getStorageAt(data.address, data.key);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object', 'result');
      }
    };
    test.data = [{
      input: {
        address: 'F67B603188441B53AD8C073E121CA1FF724230EF',
        key: 'greeting'
      }
    }]

    global.recursiveTest(test, done);
  });
});