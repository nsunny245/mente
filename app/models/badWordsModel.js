var mongoose = require('mongoose');

var bwTemp = mongoose.Schema({
    badwords: [
    ]
});

module.exports = mongoose.model('bwTemp', bwTemp);