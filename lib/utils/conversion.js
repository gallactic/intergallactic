'use strict'

const BigNumber = require('bignumber.js'),
  cxn = {},
  constant = require('../config/constant'),
  unitMap = constant.gallacticUnits,
  util = require('./common');

cxn.getUnitValue = (unit = 'boson') => {
  unit = unit.toLowerCase();
  const val = unitMap[unit];
  if (!val) {
    let msg = ('This unit currently not supported yet, please use one of the following ')
    throw new Error(msg + Object.keys(unitMap));
  }
  return util.toBigNumber(val).toNumber();
}

cxn.fromBoson = (num = 0, unit = 'gtx') => {
  const val = util.toBigNumber(num).div(cxn.getUnitValue(unit));

  return val;
};

cxn.toBoson = (num = 0, unit = 'gtx') => {
  const val = util.toBigNumber(num).times(cxn.getUnitValue(unit));

  return val;
};

module.exports = cxn;