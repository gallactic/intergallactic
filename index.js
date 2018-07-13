'use strict';

var Web4 = require('./lib/web4');

if (typeof windows !== 'undefined' && typeof window.Web4 === 'undefined') {
  window.Web4 = Web4;
}

module.exports = Web4;
