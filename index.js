const oversmash = require('oversmash');

const ow = oversmash.default();

ow.player('fw190a8#2772').then(player => { console.log(player); });

module.exports = 'foo';
