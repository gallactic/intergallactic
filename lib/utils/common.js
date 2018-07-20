'use strict'

const util = {};

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

module.exports = util;
