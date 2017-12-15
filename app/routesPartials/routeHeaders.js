var express = require('express');
var router = express.Router();
//Models
var badWordsModal = require('../app/models/badWordsModel');
var userProfile = require('../app/models/userProfile');
var contentManagerModel = require('../app/models/contentManagerModel');
var calendarModel = require('../app/models/calendarModel');
var termsAndConditionsModel = require('../app/models/tcModel');
var chatContainer = require('../app/models/chatContainer');
var timestampModel = require('../app/models/timestampModel');
var moduleModel = require('../app/models/moduleModel');
var curratedModel = require('../app/models/curratedProfiles.js');
var timelineModel = require('../app/models/timelineModel');
var mentorshipMatchModel = require('../app/models/mentorshipMatchModel');
var verificationTemp = require('../app/models/verificationTemp');
//Database
var configDB = require('../config/database.js');
//forum
var forumPost = require('../app/models/forum/post');
var unsubToken = require('../app/models/forum/unsubToken');
//customs
var timeline = require('../config/timeline.js');
var credentials = require('../config/auth');
var configParams = require('../config/config.js');

var request = require('request');//for url requests.
var fs = require('fs');
//mail service

var nodemailer = require('nodemailer');//Email services
var smtpTransport = require('nodemailer-smtp-transport');//transporter service
var sgTransport = require('nodemailer-sendgrid-transport');//If we use sendgrid
var hbs = require('nodemailer-express-handlebars');

//mail templating
const ejsLint = require('ejs-lint');
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var async = require('async');
var templatesDir = path.resolve(__dirname, '../app/public/views', 'EmailTemplates');

//TEMPLATES DEFINED HERE
//general user
var feedbackTemplate = new EmailTemplate(path.join(templatesDir, 'feedback'));
var verifyTemplate = new EmailTemplate(path.join(templatesDir, 'user/verifyAccount'));
var recoverPassTemplate = new EmailTemplate(path.join(templatesDir, 'user/recoverPassword'));
var accountRevokeTemplate = new EmailTemplate(path.join(templatesDir, 'adminConsole/accountRevoke'));
var ownAccountDeletedUserTemplate = new EmailTemplate(path.join(templatesDir, 'user/ownAccountDeletion/user')); //user
var ownAccountDeletedMenteeTemplate = new EmailTemplate(path.join(templatesDir, 'user/ownAccountDeletion/mentee')); //mentee
var ownAccountDeletedMentorTemplate = new EmailTemplate(path.join(templatesDir, 'user/ownAccountDeletion/mentor')); //mentor
var calendarEventCreatedTemplate = new EmailTemplate(path.join(templatesDir, 'user/calendarEventCreation'));
var calendarEventCancelledTemplate = new EmailTemplate(path.join(templatesDir, 'user/calendarEventCreation'));
//Forum Templates
var forumResponseTemplate = new EmailTemplate(path.join(templatesDir, 'forum/response'));

//mentorship, intro
var menteeIntroContentTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/intro/menteeIntroContent'));
var mentorIntroContentTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/intro/mentorIntroContent'));
var verifyMentorshipTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/intro/verifyMentorshipAccount')); //mentee only - self-/school verification
var menteeHasBeenApprovedTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/intro/menteeHasBeenApproved')); //mentee
var mentorHasBeenApprovedTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/intro/mentorHasBeenApproved')); //mentor
//mentorship, matching
var menteeBroadcastToMentorsTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/matching/menteeBroadcastToMentors')); //mentor
var matchesNotificationEmail = new EmailTemplate(path.join(templatesDir, 'mentorship/matching/matchesNotification')); //admin
var noMatchesAdminNotificationTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/matching/noMatchesAdminNotification')); //admin
var noMatchesMenteeNotificationTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/matching/noMatchesMenteeNotification')); //admin
var mentorChosenByMenteeTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/matching/mentorChosenByMentee')); //mentor
//mentorship, program
var researchRequestTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/researchRequest'));
var mentorAvailabilityReminderTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/mentorAvailabilityReminder')); //mentor only
var appointmentScheduledTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentScheduled')); //mentor only
var appointmentCancelledToMenteeTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentCancelledMentee'));
var appointmentCancelledToMentorTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentCancelledMentor'));
var appointmentSchedulingReminderTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentSchedulingReminder')); //mentee only
var appointmentSchedulingExpiredMenteeTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentSchedulingExpiredMentee'));
var appointmentSchedulingExpiredMentorTemplate = new EmailTemplate(path.join(templatesDir, 'mentorship/program/appointmentSchedulingExpiredMentor'));

//Admin Console Templates
var userListTemplate = new EmailTemplate(path.join(templatesDir, 'adminConsole/userList'));
var userInfoTemplate = new EmailTemplate(path.join(templatesDir, 'adminConsole/userInfo'));
var menteeAdminApproveTemplate = new EmailTemplate(path.join(templatesDir, 'adminConsole/menteeAdminApprove')); //mentee
var mentorAdminApproveTemplate = new EmailTemplate(path.join(templatesDir, 'adminConsole/mentorAdminApprove')); //mentor

//helpers
var deep = require('deep-diff');

//basically our cms (hopefully)
var butter = require('buttercms')('3d74cbbfd4a1f0333ab5da0fe2806ee19eac2be8');

var smtpConfig = {//Mail config
	host: 'smtp.gmail.com',
	port: 465,
	    secure: true, // use SSL

	    auth: {
	        user: 'leoquinttesting@gmail.com',//will be something like noreply@psdnet.com TODO
	        pass: 'testing2016'
	    }
	};
var sgConfig = {
	    auth: {
	       api_user: credentials.sendGrid.api_user,
    	   api_key: credentials.sendGrid.api_key
	    }
	};
//var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));//reusable transporter object.
var transporter = nodemailer.createTransport(sgTransport(sgConfig));
module.exports = function(app, passport){
	//Default route.
	router.get('/', function(req, res) {
		res.sendFile('./index.html', { root: __dirname } );
    });
//intentional ^