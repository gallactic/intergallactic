'use strict'

const util = {},
  BigNumber = require('bignumber.js');

/**
 * To generate uuid
 * @returns [An uuid string]
 */
util.generateUuid = () => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

/**
 * Check if given param is big number or not
 * @param {Object} obj any input including object, number or string
 * @returns {Boolean}
 */
util.isBigNumber = (obj) => {
  return obj instanceof BigNumber ||
    (obj && obj.constructor && obj.constructor.name === 'BigNumber');
};

/**
 * Convert input into a bignumber instance
 * @param {Number|String|BigNumber} num number, string, or big number
 * @returns  {BigNumber} a BigNumber instance
 */
util.toBigNumber = (num = 0) => {
  num = num || 0;
  if (util.isBigNumber(num))
    return num;

  if (typeof num === 'string' && (num.indexOf('0x') === 0 || num.indexOf('-0x') === 0)) {
    return new BigNumber(num.replace('0x', ''), 16);
  }

  return new BigNumber(num.toString(10), 10);
};


module.exports = util;
