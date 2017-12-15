var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;



var mentorSchema = new Schema({
	_id: Number,
	//contact info
	workEmail: String,
	preferredEmail: String,//REQUIRED-
	phone: String,//REQUIRED-
	firstName: String,//REQUIRED-
	middleName: String,
	lastName: String,//REQUIRED-
	//background info
	gender: [String],//REQUIRED-gender identity (male, female, transM, transF, genderQueer, other).
	age: Number, //REQUIRED-must be over 21 to be a mentor.
	isGraduate: Boolean, //REQUIRED-are you a college or university graduate. Required to be a mentor.
	highestEducation: String, //REQUIRED-College Certificate College Diploma ,Bachelor’s degree ,Master’s degree, Doctorate degree, Other specify.
	schoolType: String,
	study: String, //REQUIRED-Area of academic study (sciences, health, policy , etc...).
	currentField: String, //REQUIRED-Current field/sector of employment/volunteer experience.
	numberOfYearsInField: Number,//REQUIRED-Number of years in this area of employment and/or volunteer work.
	//Mentoring Interest
	why: String, //REQUIRED-Why are you interested in becoming a mentor?
	isCurrentlyInMentorship: Boolean, //REQUIRED-Have you had or do you currently have a mentorship relationship (informally or in a program) as a mentor or mentee?
	currentlyInMentorshipDetails: String, //REQUIRED-If yes, please describe your experience(s).
	gain: String, //REQUIRED-What do you hope to gain from this experience?
	gainMentee: String, //REQUIRED-What do you hope a mentee will gain from a mentoring relationship?
	isCommit: Boolean, //REQUIRED-Are you willng to commit to communicating online with a mentee on a regular basis for 16 weeks?
	share: String, //REQUIRED-Tell us something about yourselft we can share with mentees that you will be matched with.
	//Matching (vulontary information.)
	disabilities: [String],//Please specify the nature of your disability/disabilities (check all that apply)
	bestSuited: [String],//Who do you think you would be best suited to mentor.(check all that apply).

	//Admin fields
	approvedByAdmin: Boolean,
	trainingCompleted: Boolean,
	declarationsMade: Boolean,
	matching: Boolean,
	completedProgram: Boolean,
	completionMessage: Boolean,

	removeFromPool: Boolean,
	numberOfMentees: Number,
	mentees: [String],//emails of each mentees
	pastMentees: [{}],
	timeline: [{}],
	availability: [[{}]],
	availabilityReminder: String,// weekly, monthly, never
	blockedDates: [{}],
	addedDates: [{}],
	isPoliceChecked: Boolean,//Police check for mentors.
	policeCheck: String,//The police check file will de saved here most likely only in pdf format.
	shareProfileOptIn: Boolean,//if the mentor agree to display their profile on the mentorship's page.
	//References
	references: [{}]
}, { _id: false });

var menteeSchema = new Schema({
	_id: Number,
	//contact info
	firstName: String,
	middleName: String,
	lastName: String,
	schoolName: String,
	schoolEmail: String,
	schoolEmailVerified: Boolean,
	//background info
	gender: [String],//REQUIRED- what is you gender identity. (check all that apply).
	age: Number, //REQUIRED- Must be over 18 to participate.
	study: String,//REQUIRED-Area of academic study.
	currentField: String, //REQUIRED-Current field or sector of employement.
	why: String,//REQUIRED-Why have you decide to apply to the mentorship program.
	isCurrentlyInMentorship: Boolean,//REQUIRED-Have you or currently in a mentorship program.
	currentlyInMentorshipDetails: String,//REQUIRED-If yes, please describle your experience.
	biggestChallenge: String, //What is the number one challenge your are facing each day that your mentor may help you with.
	isCommit: Boolean,//REQUIRED-Are you willing to commit to communicate online with your mentor on a regular basis.
	share: String,// Tell us something you are willing to share with your mentor.
	//Matching info (voluntary info)
	disabilities: [String],//list all disablilities you face.
	preferences: [String],// a mentor with same gender identity, disability, education background, no preference.

	//admin fields
	dateMatched: Date, //stored here on behalf of both users
	approvedByAdmin: Boolean,
	trainingCompleted: Boolean,
	declarationsMade: Boolean,
	completedProgram: Boolean,
	completionMessage: Boolean,
	matches: [{}],
	timeline: [{}],
	remindedToSchedule: Boolean,
	mentor: String, // the mentor's email. Other info will get retrieved on the fly.
	pastMentors: [String]
}, { _id: false });


var profileSchema = new Schema({
	picture: String,//User uploaded image.
	email: String,//Used to search the DB. Personal email.
	password: String,
	since: Date,//date the user joined.
	username: String,//No unique restriction.
	status: String,
	modules: [{}],
	isUsernameApproved: Boolean,//the admin has approved this users username, this does not impede the user in any way
	documents: [String],
	mentor: [mentorSchema],//will be null until becoming a mentor.
	mentee: [menteeSchema],//will be null until becoming a mentee.
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	//Activity feed: -> types of feed: sitenotice (from the admins etc..) mentorship : (mentorship related notices)
	activities: [{/*each activity are built as : date: xxxx; type: xxxx; title: xxxx; body:xxxx; archived:true/false*/ }],

	//Forum
	votes: [{/*each votes is saved as: id:XXXXXXXXXXXXXXXXX, value: 1/-1 */ }],
});


var SALT_FACTOR = 10;
profileSchema.pre('save', function (next) {
	var user = this;

	console.log("SAVING FUNCTION");
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

profileSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR));
}

profileSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('userProfile', profileSchema);

function addDays(date, days) {
	return new Date(date + days * 86400000);
};
