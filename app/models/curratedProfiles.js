var mongoose = require('mongoose');

var curratedProfiles = mongoose.Schema({
	
	picture: String,//Profile picture taken at the time
	share: String,//Mentor's shared textarea
	highestEducation: String,
	currentField: String,
	numberOfYearsInField: Number,
	why: String, //Why is this mentor interested in mentoring.
	fullName: String, //Name to be displayed -> First name + last Name.
	other: String, //Other information that may be relevant.
	updatedOn: Date, // Date when this info was taken from the user profile.
	email: String//We use the email to make sure they are only added once.
});


module.exports = mongoose.model('curratedProfiles', curratedProfiles);