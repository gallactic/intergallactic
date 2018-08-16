'use strict';

const constant = require('../config/constant'),
  BigNumber = require('bignumber.js');

/**
 * Setting up Big Number configuration
 */
BigNumber.config(constant.bignum);

module.exports = BigNumber;