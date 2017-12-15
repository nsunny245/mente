var mongoose = require('mongoose');

var tcTemp = mongoose.Schema({
    tcObj: {
    }
});

module.exports = mongoose.model('tcTemp', tcTemp);