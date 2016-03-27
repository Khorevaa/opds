var mongoose = require('mongoose');
var config = require('.././config');

mongoose.connect(config.get('mongoose:uri'), config.get('options'));

module.exports = mongoose;