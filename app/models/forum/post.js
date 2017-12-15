var mongoose = require('mongoose');

var postReply = mongoose.Schema({
	_id: String,//made up of the post id + array index.
	message : String,
	username : String,
	userType: String,
	date: Date,//time stamp
	userEmail: String,
	upVotes: Number,
	downVotes: Number,
	reports: [{/*email of the person reporting and reason*/}],
	notify: Boolean//email subscription
});

var Post = mongoose.Schema({
		_id: String,//user email + timestamp
		authorEmail: String,//user email
		userType: String,//mentee/mentor/user/admin
		username: String,//username
		date: Date,//time stamp
		subject: String,//title
		message: String,//body
		forumID: Number,//Forum owner
		tags: [String],		
		upVotes: Number,
		downVotes: Number,
		reports: [{/*email of the person reporting and reason*/}],
		replies: [postReply],//replies from other users.
		notify: Boolean//email subscription
});


module.exports = mongoose.model('Post', Post);

