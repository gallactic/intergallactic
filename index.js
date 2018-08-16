'use strict';

var Intergallactic = require('./lib/intergallactic');

if (typeof windows !== 'undefined' && typeof window.Intergallactic === 'undefined') {
  window.Intergallactic = Intergallactic;
}

module.exports = Intergallactic;
