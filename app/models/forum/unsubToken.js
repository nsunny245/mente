var mongoose = require('mongoose');

var unsubToken = mongoose.Schema({
	email: String,
	postId: String,
	linkID: String,
	date: Date,
	host: String
});

module.exports = mongoose.model('unsubToken', unsubToken);