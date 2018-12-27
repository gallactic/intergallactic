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

  it('"listAccounts", should return list of account details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.listAccounts()
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
        address: 'acFVrNat8Y8Evid4fcJzN5KxyEAyuHS6Tuu'
      },
      validate: (res) => {
        expect(res.body.result.Account.address).to.equal('acFVrNat8Y8Evid4fcJzN5KxyEAyuHS6Tuu');
      }
    }, {
      input: {
        address: 'acT1MVKCaTVKhBwpMr667vA9VRtubFtiwZf'
      },
      validate: (res) => {
        expect(res.body.result.Account.address).to.equal('acT1MVKCaTVKhBwpMr667vA9VRtubFtiwZf');
      }
    }],

    glOrWd.runTest(test, done);
  });

  it('"listValidators", should return list of validator account details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.listValidators()
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.BondedValidators).to.be.an('array');
        expect(res.body.result.UnbondingValidators).to.not.equal(undefined);
      }
    };

    test.data = [{
      input: {}
    }];

    glOrWd.runTest(test, done);
  })

  it('"getValidator", should return validator account details', function (done) {
    const test = {
      function: (data) => {
        return igc.account.getValidator(data.address);
      },
      validate: (res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.be.an('object');
        expect(res.body.result.Validator).to.be.an('object');
      }
    };

    test.data = [{
      input: {
        address: 'vaBdTQnKWstzbP9rrMCvPP4rxqLU3PDvKHM'
      },
      validate: (res) => {
        expect(res.body.result.Validator.publicKey).to.be.a('string');
      }
    }];

    glOrWd.runTest(test, done);
  })

  it.skip('"getStorage", should return storage details', function (done) {
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
        address: 'acHcDPZqkYYDsVFAypgX77xuZDNqQDbynpP'
      }
    }]

    glOrWd.runTest(test, done);
  });

  it.skip('"getStorageAt", should return storage details', function (done) {
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
        address: 'acG9u2dcdu1kZoSEyxuGU7aWv3sHA8KNebo',
        key: 'greeting'
      }
    }]

    glOrWd.runTest(test, done);
  });
});