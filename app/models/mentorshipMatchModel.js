var mongoose = require('mongoose');

var mentorshipMatch = mongoose.Schema({
	date: Date,
	matches:{
		token: String,
		expToken: String,
		mentee: String,//mentee's email to search DB
		mentors: [{}]//Mentor's info
		//{
		//	email
		//	name
		//	share
		//	field
		//	higestEducation
		//	picture
		//	request -> either sent, denied, approved
		//  id
		//}
	}
});

module.exports = mongoose.model('mentorshipMatch', mentorshipMatch);