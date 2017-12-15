var mongoose = require('mongoose');

var verificationTemp = mongoose.Schema({
	user: Object,
	email: String,
	date: Date,
	linkID: String,
	toVerify: String,
	host: String
});

module.exports = mongoose.model('verificationTemp', verificationTemp);