//Functions///////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 							FUNCTIONS    									//
//																				//
//////////////////////////////////////////////////////////////////////////////////



function removeProfile(req, res, callback = null) {
	//if an external email is appended to the body, then use that instead of the user
	let email;

	if (req.body.email) {
		email = req.body.email;
	} else if (!req.user) {
		console.log("Not logged in");
		return res.sendStatus(401);
	}

	userProfile.findOne({ 'email': email }, function (err, doc) {
		if (err) {
			console.log("Can't find user profile");
			return res.sendStatus(400);
		}
		doc.remove();
		if (typeof callback !== 'null') {
			callback();
		}
		return res.send("deleted " + email);
	})
}

//email related functions
transporter.use('compile', hbs({
	viewpath: 'views/emails',
	extName: '.hbs'
}));

function UpdateDoc(obj) {
	for (var i = 1; i < arguments.length; i++) {
		for (var prop in arguments[i]) {
			var val = arguments[i][prop];
			if (typeof val == "object") // this also applies to arrays or null!
				update(obj[prop], val);
			else
				obj[prop] = val;
		}
	}
	return obj;
};


//sends the feedback to both you (if you entered in one) and some third party reviewer
function SendFeedbackEmail(req, callback) {
	var defaultEmail = "feedback@psdnet.com"

	if (req.body.email) {
		defaultEmail = req.body.email;
	}
	//locals is the data to pass on to the parser
	//you can make dynamic data to pass to the html parser
	var locals = {
		feedback: req.body.feedback,
		subject: req.body.subject
	}
	feedbackTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		//if you provided an email, the admins essentially recieve an email from "you"
		var mailConfAdmins = {
			from: defaultEmail, // sender address
			//TODO, change it to production later...
			to: configParams.mailingLists['feedback'],// list of receivers
			subject: 'Feedback from a user: ' + req.body.subject, // Subject line
			text: results.text,
			html: results.html
		};

		//vv you will also recieve a copy if you provided a valid email
		var mailConfUsers = {
			from: "noreply@psdnet.com", // sender address
			//TODO, change it to production later...
			to: req.body.email,// list of receivers
			subject: 'Feedback you sent to Communability: ' + req.body.subject, // Subject line
			text: results.text,
			html: results.html
		};
		if (req.body.email) {
			transporter.sendMail(mailConfUsers, function (error, info) {
				console.log("message sent to user");
			});
		}
		//only error res that matters->
		transporter.sendMail(mailConfAdmins, function (error, info) {
			if (error) {
				return callback(false, err);
			}
			console.log("message sent to admins");
			return callback(true);
		});
	});
}
//Send an email to verify a user's account.
function SendConfEmail(req, res, callback) {
	console.log("building email confirmation");
	var host = req.get('host');

	var convertedASCII = stringToASCII(req.user.email);
	var token = convertedASCII + GenString(20);
	link = "http://" + host + "/mail/verify?id=" + token;
	console.log(link);
	var locals = {
		username: req.user.username,
		conflink: link
	}
	verifyTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: [req.user.email, configParams.mailingLists["debug"]],  // list of receivers
			subject: 'Welcome to CommunAbility! Please confirm your email account', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
		//saves a temporary token we can compare toverify email.
		var tempToken = new verificationTemp();
		tempToken.email = req.user.email;
		tempToken.linkID = token;
		tempToken.date = Date.now();
		tempToken.host = host;
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
			else {
				console.log("Calling back");
				return callback({ message: configParams.notifications.verificationEmail + " " + req.user.email });
			}
		});
	});
}
//Send an email to a user informing them of account deletion 
function SendUserRevokeEmail(req, res, callback) {
	var locals = {
		username: req.body.username
	}
	accountRevokeTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var deleteEmail = {
			from: 'noreply@psdnet.com', // sender address
			to: [req.body.email, configParams.mailingLists["debug"]], // list of receivers
			subject: '', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(deleteEmail, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
			callback();//call the next function to trigger
		});
	})
}
//user/mentee/mentor deletes own account
function SendOwnAccountDeletedEmail() {
	console.log("building mentee approval notification email");

	switch (req.body.userType) {
		case 'general':
			break;
		case 'mentee':
			break;
		case 'mentor':
			break;
	}
	var locals = {
		username: req.body.name,
		//callToActionLink: 'http://'+ req.get('host') +'/profile/timeline',
	}
	ownAccountDeletedUserTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: [req.body.email, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Were sorry to see you go!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
//calendar event creation/cancellation
function SendCalendarCreationEmail() {
	
}
function SendCalendardeletionEmail() {
	
}
//send notification of a reply to one's own post
function SendPostResponseEmail(req, res, callback, replyData, postData) {
	var host = req.get('host');

	let linkToPost = "http://"+ host +"/#/community/forums/"+ postData.id;
	console.log(linkToPost);

	var convertedASCII = stringToASCII(req.user.email);
	var token = convertedASCII + GenString(20);
	var unsubLink = "http://" + host + "/forum/receiveUnsub?id=" + token;
	console.log(unsubLink);

	var locals = {
		reply: replyData,
		postLink: linkToPost,
		unsubLink: unsubLink
	};
	console.log(locals);
	forumResponseTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var postResponseEmail = {
			from: 'noreply@psdnet.com', // sender address
			to: [postData.email, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Someone responded to your forum post "'+ postData.subject +'"', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(postResponseEmail, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
			return callback(req, res);//call the next function to trigger
		});

		//saves a temporary token we can compare toverify email.
		var tempToken = new unsubToken();
		tempToken.email = req.user.email;
		tempToken.postId = postData.id;
		tempToken.linkID = token;
		tempToken.date = Date.now();
		tempToken.host = host;
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
		});
	});
}


//Send an email to verify a user's account.
function SendMenteeIntroContentEmail(req, res, callback) {
	console.log("building mentee intro content email");

	var locals = {
		username: req.body.firstName + " " + req.body.lastName
	}
	menteeIntroContentTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var introEmail = {
			from: 'noreply@psdnet.com', // sender address
			to: [req.user.email, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Welcome to the Mentorship Program!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(introEmail, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
function SendMentorIntroContentEmail(req, res, callback) {
	console.log("building mentor intro content email");

	var locals = {
		username: req.body.firstName + " " + req.body.lastName
	}
	mentorIntroContentTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var introEmail = {
			from: 'noreply@psdnet.com', // sender address
			to: [req.user.email, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Welcome to the Mentorship Program!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(introEmail, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
//Sends a link to verify the user's school email account.
function SendSchoolEmailToken(req, res, callback) {//requires both school email and account emails.
	var user = req.user;
	var host = req.get("host");
	console.log("THE USER FOR SCHOOL EMAIL TOKEN IS", user);
	var userSchoolEmail = user.email;

	var convertedASCII = stringToASCII(userSchoolEmail);
	var token = convertedASCII + GenString(20);
	let link = "http://" + host + "/mail/verifySchool?id=" + token;
	console.log(link);
	var schoolLocals = {
		username: user.username,
		verifyLink: link
	}
	verifyMentorshipTemplate.render(schoolLocals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var schoolMailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: userSchoolEmail, // list of receivers
			subject: 'Welcome to the CommunAbility Mentorship program, ' + user.username + ". Please confirm your application.", // Subject line
			text: results.text,
			html: results.html
		};

		transporter.sendMail(schoolMailConf, function (error, info) {
			if (error) {
				return callback(false, err);
			}
			console.log('Message sent: ' + info.response);

			return callback(true);
		});
		//saves a temporary token we can compare toverify email.
		var tempToken = new verificationTemp();
		tempToken.user = user;
		//tempToken.email = user.email;
		tempToken.linkID = token;
		tempToken.toVerify = userSchoolEmail;
		tempToken.host = host;
		var today = new Date();
		var DAYSBEFOREEXPIRYOFTOKEN = 14;
		today.setTime(today.getTime() + DAYSBEFOREEXPIRYOFTOKEN * 86400000);
		tempToken.date = today;
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
			else {
				console.log("Valid school email!");
				return callback({ status: true });
			}
		});
	});
}
//mentee has been approved
function SendMenteeHasBeenApprovedEmail(req, res, userName, userEmail, awaitingApproval) {
	console.log("building mentee approval notification email");

	var locals = {
		username: userName,
		callToActionLink: 'http://'+ req.get('host') +'/profile/timeline',
		awaitingApproval: awaitingApproval
	}
	menteeHasBeenApprovedTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: [userEmail, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Congratulations, you have been approved for CommunAbility\'s e-Mentorship program!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
//mentor has been approved
function SendMenteeHasBeenApprovedEmail(req, res, userName, userEmail) {
	console.log("building mentor approval notification email");

	var locals = {
		username: userName,
		callToActionLink: 'http://'+ req.get('host') +'/profile/timeline'
	}
	mentorHasBeenApprovedTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: [userEmail, configParams.mailingLists["debug"]], // list of receivers
			subject: 'Congratulations, you have been approved for CommunAbility\'s e-Mentorship program!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}

//mentee broadcasts request
function SendMenteeBroadcastToMentorsEmail(req, res, mentor, mentee, link) {
	console.log("building mentee broadcast email");

	var locals = {
		username: mentor.name,
		mentee: mentee,
		conflink: link
	}
	menteeBroadcastToMentorsTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mentorRequest = {
			from: 'noreply@psdnet.com', // sender address
			to: mentor.email,  // list of receivers
			subject: 'Mentoring opportunity available!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mentorRequest, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
//mentee has been approved
function SendMatchesNotificationEmail(matchesObject) {
	console.log("building mentee matches arrival notification email");

	let mentee = matchesObject.matches.mentee;

	userProfile.findOne({ 'email': mentee }, function (err, user) {

		var locals = {
			username: user.mentee[0].firstName +" "+ user.mentee[0].lastName,
			mentorshipTab: 'http://'+ req.get('host') +'/profile/mentorship'
		}

		matchesNotificationTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var email = {
				from: 'noreply@psdnet.com', // sender address
				to: [user.email, configParams.mailingLists["debug"]], // list of receivers
				subject: 'Your mentorship matches have come in!', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(email, function (error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		});
	});
}
//no match found within 48h period
function SendNoMatchesAdminNotificationEmail(matchesInstance, menteeName, callback = null) {
	console.log("building mentor chosen notification email");

	var locals = {
		menteeName: menteeName,
		matchesInstance: matchesInstance.matches
	}
	noMatchesAdminNotificationTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: configParams.mailingLists['admin'], // list of receivers
			subject: 'User '+ menteeName +' was unable to find a mentor', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
			return callback();
		});
	});
}
//mentee has been approved
function SendNoMatchesMenteeNotificationEmail(matchesObject, menteeName) {
	console.log("building mentee matches arrival notification email");

	let mentee = matchesObject.matches.mentee;

	userProfile.findOne({ 'email': mentee }, function (err, user) {

		var locals = {
			username: menteeName,
			mentorshipTab: 'http://'+ req.get('host') +'/profile/mentorship'
		}

		noMatchesMenteeNotificationTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var email = {
				from: 'noreply@psdnet.com', // sender address
				to: [user.email, configParams.mailingLists["debug"]], // list of receivers
				subject: 'We were unable to find mentors for you at this time', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(email, function (error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		});
	});
}
//mentor has been chosen by mentee
function SendMentorChosenByMenteeEmail(req, res, mentor) {
	console.log("building mentor chosen notification email");

	var locals = {
		username: mentor.mentor[0].firstName +" "+ mentor.mentor[0].lastName,
		mentorshipTab: 'http://'+ req.get('host') +'/profile/mentorship',
		chatTab: 'http://'+ req.get('host') +'/profile/chat'
	}
	mentorChosenByMenteeTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: mentor.email, // list of receivers
			subject: 'You have been accepted by your mentee!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}


//Goes through the list of mentors and sends email reminders to update their availabilities.
function SendAvailabilityReminder(isWeekly, isMonthly, callback) {
	userProfile.find({ 'status': 'mentor' }, function (err, docs) {
		var link = "http://localhost:8080/#/home";
		var emailList = [];
		for (var i = 0; i < docs.length; i++) {
			if (isWeekly && docs[i].mentor[0].availabilityReminder === 'weekly') {
				emailList.push(docs[i].email);
			}
			if (isMonthly && docs[i].mentor[0].availabilityReminder === 'monthly') {
				emailList.push(docs[i].email);
			}
		}
		if (emailList.length === 0) { return callback(true); }


		var host = req.get('host');
		let linkToCalendar = "http://"+ host +"/#/profile/calendar";
		console.log(linkToPost);

		var locals = {
			calLink: linkToCalendar
		};
		console.log(locals);
		mentorAvailabilityReminderTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var emailReminder = {
				from: 'noreply@psdnet.com', // sender address
				to: emailList, // list of receivers
				subject: 'Reminder to update your availability', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(emailReminder, function (error, info) {
				if (error) {
					console.log(info);
					console.log(error);
					return callback(false, err);
				}
				console.log('Message sent: ' + info.response);
				return callback(req, res);
			});
		});

	});
}
function SendAppointmentScheduledEmail(req, res, ap) {
	var mentor = req.user.mentee[0].mentor;
	userProfile.findOne({ 'email': mentor }, function (err, userMentor) {
		if (err) {
			return console.error(err);
		}

		locals = {
			mentorName: userMentor.mentor[0].firstName +" "+ userMentor.mentor[0].lastName,
			menteeName: req.user.mentee[0].firstName +" "+ req.user.mentee[0].lastName,
			ap: ap,
			calLink: 'http://'+ req.get('host') +'/profile/calendar'
		};

		appointmentScheduledTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var email = {
				from: 'noreply@psdnet.com', // sender address
				to: mentor, // list of receivers
				subject: 'New Appointment Scheduled', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(email, function (error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		});
	});
}
function SendCancelledAppointmentEmail(req, res, mentee, event, toMentee) {

	userProfile.findOne({ 'email': mentee.mentee[0].mentor }, function (err, mentor) {
		if (err) {
			return console.error(err);
		}

		locals = {
			mentorName: mentor.mentor[0].firstName +" "+ mentor.mentor[0].lastName,
			menteeName: mentee.mentee[0].firstName +" "+ mentee.mentee[0].lastName,
			ap: event,
			chatLink: 'http://'+ req.get('host') +'/profile/chat',
			calLink: 'http://'+ req.get('host') +'/profile/calendar',
			timelineLink: 'http://'+ req.get('host') +'/profile/calendar'
		};

		if (toMentee) {
			appointmentCancelledToMenteeTemplate.render(locals, function (err, results) {
				if (err) {
					return console.error(err);
				}
				var email = {
					from: 'noreply@psdnet.com', // sender address
					to: mentee.email, // list of receivers
					subject: 'Mentorship Appointment Cancelled', // Subject line
					text: results.text, // plaintext body
					html: results.html
				};

				transporter.sendMail(email, function (error, info) {
					if (error) {
						return console.log(error);
					}
					console.log('Message sent: ' + info.response);

				});
			});
		} else {
			appointmentCancelledToMentorTemplate.render(locals, function (err, results) {
				if (err) {
					return console.error(err);
				}
				var email = {
					from: 'noreply@psdnet.com', // sender address
					to: mentor.email, // list of receivers
					subject: 'Mentorship Appointment Cancelled', // Subject line
					text: results.text, // plaintext body
					html: results.html
				};

				transporter.sendMail(email, function (error, info) {
					if (error) {
						return console.log(error);
					}
					console.log('Message sent: ' + info.response);

				});
			});
		}
	});
}
function SendAppointmentSchedulingReminderEmail(mentee, eventIndex) {
	locals = {
		menteeName: mentee.mentee[0].firstName +" "+ mentee.mentee[0].lastName,
		ap: mentee.mentee[0].timeline[eventIndex],
		timelineLink: 'http://'+ req.get('host') +'/profile/timeline'
	};

	appointmentSchedulingReminderTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var email = {
			from: 'noreply@psdnet.com', // sender address
			to: mentee.email, // list of receivers
			subject: 'Remember to Schedule Your Next Appointment!', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(email, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
	});
}
function SendAppointmentSchedulingExpiredEmail(mentee, eventIndex) {

	userProfile.findOne({ 'email': mentee.mentee[0].mentor }, function (err, mentor) {
		if (err) {
			return console.error(err);
		}

		locals = {
			mentorName: mentor.mentor[0].firstName +" "+ mentor.mentor[0].lastName,
			menteeName: mentee.mentee[0].firstName +" "+ mentee.mentee[0].lastName,
			ap: mentee.mentee[0].timeline[eventIndex],
			chatLink: 'http://'+ req.get('host') +'/profile/chat',
			calLink: 'http://'+ req.get('host') +'/profile/calendar',
			timelineLink: 'http://'+ req.get('host') +'/profile/calendar'
		};

		appointmentSchedulingExpiredMenteeTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var email = {
				from: 'noreply@psdnet.com', // sender address
				to: mentee.email, // list of receivers
				subject: 'Mentorship Appointment Booking Expired', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(email, function (error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		});

		appointmentSchedulingExpiredMentorTemplate.render(locals, function (err, results) {
			if (err) {
				return console.error(err);
			}
			var email = {
				from: 'noreply@psdnet.com', // sender address
				to: mentor.email, // list of receivers
				subject: 'Mentorship Appointment Booking Expired', // Subject line
				text: results.text, // plaintext body
				html: results.html
			};

			transporter.sendMail(email, function (error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		});
	});
}
//Research Request
function SendResearchRequestEmail() {}

//Sends the ICal link.
function SendIcalLink(req, callback) { //send ical link
	//once new event is created, create the ical link and send it via email
	//Ical
	var ap = req.body.event;
	var apStart = new Date(ap.start);
	var ical = require('ical-generator'),
		http = require('http'),
		cal = ical({//directly creating event/ics file
			domain: 'beu.com',
			name: 'ical TEST',
			events: [
				{
					start: apStart,
					end: new Date(apStart.getTime() + ap.duration * 60 * 1000),//curr time plus duration
					timestamp: new Date(),
					description: 'Meeting Booked',
					summary: ap.title,//TODO: generalize event titles so mentee/mentor see both
					organizer: 'CommunAbility <noreply@psdnet.com>'
				}
			]
		});

	var serverIcal = http.createServer(function (req, res) {//create a temp server to send .ics file
		cal.serve(res);
	}).listen(3000, '127.0.0.1', function () {
		console.log('Server running at http://127.0.0.1:3000/');
	})

	//recips are mentee and mentor
	var recipients = [req.user.email, req.user.mentee[0].mentor, configParams.mailingLists["debug"]];
	var j = 0;//index for foreach
	recipients.forEach(function (to, array) {
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			subject: "Reminder: " + ap.title, // Subject line
			text: 'You have an appointment! See attached for details', // plaintext body
			html: "<h1>You have an appointment! See attached for details</h2> <br>" + cal.toString(),
			attachments: [
				{
					filename: ap.title + '.ics',
					path: 'http://127.0.0.1:3000/'
				}
			]
		};
		mailConf.to = to;//each item sent to list index val

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

			if (j == recipients.length - 1) {//on last pass shut down the server
				serverIcal.close();
				console.log("Temp Server Close");
				return callback(cal);

			}
			j++;
		});

	})
}
function SendIcalCancellation(req, callback) {
	var ap = req.body.event;
	var apStart = new Date(ap.start);
	var ical = require('ical-generator'),
		http = require('http'),
		cal = ical({//directly creating event/ics file
			domain: 'beu.com',
			name: 'ical TEST',
			events: [
				{
					start: apStart,
					end: new Date(apStart.getTime() + ap.duration * 60 * 1000),//curr time plus duration
					status: 'cancel',
					timestamp: new Date(),
					description: 'Metting Cancelled',
					summary: ap.title,//TODO: generalize event titles so mentee/mentor see both
					organizer: 'CommunAbility <noreply@psdnet.com>'
				}
			]
		});

	var serverIcal = http.createServer(function (req, res) {//create a temp server to send .ics file
		cal.serve(res);
	}).listen(3000, '127.0.0.1', function () {
		console.log('Server running at http://127.0.0.1:3000/');
	})

	//recips are mentee and mentor
	var recipients = [req.user.email, req.user.mentee[0].mentor, configParams.mailingLists["debug"]];
	var j = 0;//index for foreach
	recipients.forEach(function (to, array) {
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			subject: "Attention: " + ap.title, // Subject line
			text: 'This appointment has been cancelled! See attached for details', // plaintext body
			html: "<h1>This appointment has been cancelled! See attached for details</h2> <br>" + cal.toString(),
			attachments: [
				{
					filename: ap.title + '.ics',
					path: 'http://127.0.0.1:3000/'
				}
			]
		};
		mailConf.to = to;//each item sent to list index val

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

			if (j == recipients.length - 1) {//on last pass shut down the server
				serverIcal.close();
				console.log("Temp Server Close");
				return callback(cal);

			}
			j++;
		});

	})
}


//admin receives notification - deprecated
function SendMenteeAdminApproveEmail(req, res, callback, host) {
	var user = req.user;
	console.log("AMINASDASDASD USER IS ", user);
	console.log("ADMINNNNNNNNNNNNNNNNNNNNNN OBJECT FUNC", req);
	var convertedASCII = stringToASCII(user.email);
	var token = convertedASCII + GenString(20);
	link = "http://" + host + "/adminMail/adminApproveMentee?id=" + token;
	console.log(link);

	var locals = {
		user: user,
		conflink: link
	}
	menteeAdminApproveTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: configParams.mailingLists['admin'], // list of receivers
			subject: 'Approve New Mentee: ' + user.email, // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
		//saves a temporary token we can compare toverify email.
		var tempToken = new verificationTemp();
		tempToken.user = user;
		tempToken.linkID = token;
		tempToken.date = Date.now();
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
			else {
				console.log("Calling back");
				return callback({ message: configParams.notifications.verificationEmail + " " + user.email });
			}
		});
	})
}
//admin receives notification - deprecated
function SendMentorAdminApproveEmail(req, res, callback) {
	var user = req.user;
	console.log("AMINASDASDASD USER IS ", user);
	console.log("ADMINNNNNNNNNNNNNNNNNNNNNN OBJECT FUNC", req);

	//DIFFERNTIATE IF INBOUND FROM SIGNUP OR FROM ADMIN CONSOLE vvvv
	if (user.mentor.length == 0) {
		user.mentor.push(req.body);
	}

	var convertedASCII = stringToASCII(user.email);
	var token = convertedASCII + GenString(20);
	link = "http://" + req.get("host") + "/adminMail/adminApproveMentor?id=" + token;
	console.log(link);

	var locals = {
		user: user,
		conflink: link
	}
	mentorAdminApproveTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: configParams.mailingLists['admin'], // list of receivers
			subject: 'Approve New Mentor: ' + user.mentor[0].workEmail, // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});
		//saves a temporary token we can compare toverify email.
		var tempToken = new verificationTemp();
		tempToken.user = user;
		tempToken.linkID = token;
		tempToken.date = Date.now();
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
			else {
				console.log("Calling back");
				return callback({ message: configParams.notifications.verificationEmail + " " + user.email });
			}
		});
	})
}
//from the information given, send an email to the admin about a specific user. This function is triggered when a user clicks a link in the user list email. It is called in /adminMail/sendUserToAdmin - deprecated
function SendUserInfoEmailToAdmin(req, res, callback, host) {
	var user = req.user;

	var convertedASCII = stringToASCII(user.email);
	var deleteToken = convertedASCII + GenString(20);
	let revokeLink = "http://" + host + "/adminMail/deleteUser?id=" + deleteToken;

	var locals = {
		user: user,
		revokeLink: revokeLink
	}
	userInfoTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: configParams.mailingLists['admin'], // list of receivers
			//TODO, better title
			subject: 'Info Request: ' + user.email, // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
		var tempToken = new verificationTemp();
		tempToken.user = user;
		tempToken.host = host;
		tempToken.date = Date.now();
		tempToken.linkID = deleteToken;
		tempToken.save(function (err) {
			if (err) {
				throw err;
			}
		});

	})
}


//TODO, remove this later
// router.post('/fooing/sendUserListToAdminTEST', function (req, res) {
// 	var test = [];
// 	console.log("hi");
// 	userProfile.find(function (err, docs) {
// 		if (err) { res.sendStatus(400); }
// 		test.users = docs;
// 		SendUserListToAdmin(test, res, req.get("host"));
// 	})
// })




//get a complete user list, this is called in /admin/accounts/getAllUsers

//send an email to get a list of all users to the admin!
function SendUserListToAdmin(req, res, host) {//requires both school email and account emails.
	//get a list of users
	var listOfUsers = req.users;
	console.log("ADMINNNNNNNNNNNNNNNNNNNNNN USER LISTTTTTTTT OBJECT FUNC", req);

	//DIFFERNTIATE IF INBOUND FROM SIGNUP OR FROM ADMIN CONSOLE vvvv
	// if (user.mentor.length == 0) {
	// 	user.mentor.push(req.body);
	// }

	//iterate through the user list and create unique tokens for each user
	for (let i = 0; i < listOfUsers.length; i++) {
		var convertedASCII = stringToASCII(listOfUsers[i].email);
		var token = convertedASCII + GenString(20);
		var link = "http://" + host + "/adminMail/sendUserToAdmin?id=" + token;
		//append the unique link to access it through the email
		listOfUsers[i].requestInfo = link;
		//append the token to act as verification for the mail route function 'sourceVerify'
		listOfUsers[i].unqiueToken = token;
	}

	//render template to be sent
	var locals = {
		users: listOfUsers
	}

	userListTemplate.render(locals, function (err, results) {
		if (err) {
			return console.error(err);
		}
		var mailConf = {
			from: 'noreply@psdnet.com', // sender address
			to: configParams.mailingLists['admin'], // list of receivers
			subject: 'List of Communability Users', // Subject line
			text: results.text, // plaintext body
			html: results.html
		};

		transporter.sendMail(mailConf, function (error, info) {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);

		});

		//saves a temporary token for each found member. This token provides details for when a unique link is clicked
		listOfUsers.forEach(function (user, index) {
			var tempToken = new verificationTemp();
			tempToken.user = user;
			tempToken.host = host;
			tempToken.date = Date.now();
			tempToken.linkID = user.unqiueToken;
			tempToken.save(function (err) {
				if (err) {
					throw err;
				}
				console.log('saving');
				if (index == listOfUsers.length - 1) {
					console.log("Calling back");
					return true;
				}
			});
		}, this);
		//		for (let i = 0; i < listOfUsers.length; i++) {
		//		}
	})
};


//Calls the maintenance functions.
function StartDailyFunctions(host) {//Function called at regular interval.

	
	clearMatchesModels(); // 48h period mentor window, 72h period for matchless reset
	clearMenteeMatches(); // 7d - 48h period mentee window

	sendRemindersToSchedule();
	letBookingWindowsExpire();


	ClearExpiredTokens(function (count) {
		console.log("clear expired tokens:" + count);
	});
	ClearUnverifiedExpiredAccounts(function (count) {
		console.log("Clear expired unverified accounts:" + count);
	});
	var currentDate = new Date();
	if (currentDate.getDay() === 0 && currentDate.getHours() === 12)//weekly
	{
		SendAvailabilityReminder(true, false, function (res) {
			console.log(res);
		});
	}
	if (currentDate.getDate() === 1 && currentDate.getHours() === 12) {
		SendAvailabilityReminder(false, true, function (res) {
			console.log(res);

		});
	}
	if (currentDate.getHours() === 1)//Daily at 1am
	{
		//check for auto-completion of appointments.
		//waits at least 1 day to 1am.
		AutoCompleteAppointments();
		//send admin a list of users 
		var test = [];
		// userProfile.find(function (err, docs) {
		// 	if (err) {
		// 		console.log("could not find user");
		// 	} else {
		// 		test.users = docs;
		// 		SendUserListToAdmin(test, function (res) {
		// 			console.log(res);
		// 		}, req.get("host"));
		// 	}
		// })


	}
	setTimeout(StartDailyFunctions, 3600000);//1h interval.
};
//Updates the timelines of mentees if they have finish their appointments.
function AutoCompleteAppointments() {//TODO this is kinda bad...
	return;
	userProfile.find({ 'status': 'mentee' }, function (err, docs) {
		if (err || !docs) {
			console.log(err);
			return;
		}

		console.log('Checking ' + docs.length + " mentees");
		var currentTime = new Date().getTime();

		for (var i = 0; i < docs.length; ++i)//cycle through all the mentees
		{

			docs[i].mentee[0].remindedToSchedule = false;

			for (var j = 0; j < docs[i].mentee[0].timeline.length; ++j)//cycle through all their timeline events
			{
				var timeEvent = docs[i].mentee[0].timeline[j];
				console.log(timeEvent.key.slice(4, 11));
				console.log(timeEvent.status === 'inprogress');
				//checks if its a meeting and if its inprogress (status)
				if (timeEvent.key.slice(4, 11) === 'meeting' && timeEvent.status === 'inprogress') {
					console.log(timeEvent.start);
					console.log(currentTime);
					console.log(timeEvent.start + configParams.appointments.autoCompleteDelay);
					console.log(timeEvent.start + configParams.appointments.autoCompleteDelay < currentTime);
					//Check if the meeting was in the past.
					if (timeEvent.start != null
						&& timeEvent.start + configParams.appointments.autoCompleteDelay < currentTime) {
						console.log(i);
						console.log(docs[i]);

						advanceTimeline(docs[i], timeEvent.key);

						/*GetChatContainer(docs[i].email, docs[i].mentee[0].mentor , function(err, chatCTN){//Loads the chat
							console.log(i);
							console.log(docs[i]);
							if(configParams.appointments.autoCompleteIfEmpty)//if we want to complete regardless of interactions.
							{
								console.log("Saving appointment completed");
								var overritingEvent = docs[i].mentee[0].timeline[j];
								overritingEvent = 'inprogress';
								docs[i].mentee[0].timeline[j].splice(overritingEvent.id, 1, overritingEvent);
							}
							else//check for chat content.
							{
								var index = chatCTN.chats.map(function(e){return e.key;}).indexOf(docs[i].mentee[0].timeline[j].key);
								if(index != -1 && chatCTN.chats[index].messages.length > configParams.appointments.autoCompleteMinimunChat)
								{
									var overritingEvent = docs[i].mentee[0].timeline[j];
									overritingEvent = 'inprogress';
									docs[i].mentee[0].timeline[j].splice(overritingEvent.id, 1, overritingEvent);
								}
							}
						});*/

					}
				}
			}
		}
	});
};

function advanceTimeline(mentee, eventKey) {
	UpdateTimelineEvent(mentee, eventKey, 'completed', function (success) {
		console.log('saved? ' + success);
	});
	//This isnt the best sry.
	switch (eventKey) {
		case 'std-meeting-1':
			UpdateTimelineEvent(mentee, 'mrk-phase-1', 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "std-meeting-2", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, 'mrk-phase-2', 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-2':
			UpdateTimelineEvent(mentee, "mrk-phase-2", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "std-meeting-3", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "mrk-phase-3", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-3':
			UpdateTimelineEvent(mentee, "std-meeting-4", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-4':
			UpdateTimelineEvent(mentee, "std-meeting-5", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-5':
			UpdateTimelineEvent(mentee, "mrk-phase-3", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "std-meeting-6", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "mrk-phase-4", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-6':
			UpdateTimelineEvent(mentee, "mrk-phase-4", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "mrk-closing", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "std-meeting-7", 'inprogress', function (success) {
				console.log('saved? ' + success);
			});
			break;
		case 'std-meeting-7':
			UpdateTimelineEvent(mentee, "mrk-16-week-curriculum", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "mrk-closing", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "std-meeting-7", 'completed', function (success) {
				console.log('saved? ' + success);
			});
			UpdateTimelineEvent(mentee, "mrk-end-of-curriculum", 'completed', function (success) {
				console.log('saved? ' + success);
			});


			var pastIndex = mentee.mentee[0].pastMentors.length;
			//closing mentee's mentor
			var query = { 'email': mentee.mentee[0].mentor };
			userProfile.findOne(query, function (err, mentor) {
				if (err) {
					console.log(err);
				}

				var index;
				var compId = mentee.mentee[0]._id;
				for (let i=0; i<mentor.mentee.length; ++i) {
					if (mentor.mentee[i]._id == compId) {
						index = i;
						break;
					}
				}
				closeRelationship(mentor, false, pastIndex, index);
			});

			//closing mentee
			closeRelationship(mentee, true, pastIndex);
	};
}
function scheduleChat(mentee, mentor, eventKey, eventStart, callback = null) {
	GetChatContainer(req.user.email, mentorEmail, function (err, chatCTN) {
		console.log(chatCTN);
		var index = chatCTN.chats.map(function (e) { return e.key; }).indexOf(eventKey);
		console.log("Index: " + index);
		chatCTN.chats[index].scheduledFor = new Date(eventStart).getTime();
		console.log(chatCTN.chats[index].scheduledFor);
		chatCTN.markModified('chats');
		chatCTN.save(function (err) {
			if (err) {
				console.log(err);
			}
			console.log("Success saving chat date?");
			if (callback != null) {
				callback(err);
			}
		});
	});
}

function userIsMentee() {
	if (!req.user) {
	  return undefined;
	}
	switch(req.user.status) {
	  case 'menteeInTraining':
	  case 'menteeSeeking':
	  case 'mentee':
	    return true;
	  case 'mentorInTraining':
	  case 'mentor':
	    return false;
	  default:
	    return undefined;
	}
}

//closing process
function closeRelationship(user, isMentee, pastIndex, partnerIndex = 0) {
	if (isMentee) {
		//set complete
		user.mentee[0].completedProgram = true;
		user.mentee[0].completionMessage = true;
		//archive chat
		user.mentee[0].pastMentors.push(user.mentee[0].mentor);
		//delete remaining mentorship data
		user.status = "menteeInTraining";
		user.mentee[0].mentor = "";
		user.mentor.splice(0,1);
	} else {
		user.mentor[0].completedProgram = true;
		user.mentor[0].completionMessage = true;

		let mentee = {
			email: user.mentor[0].mentees[partnerIndex],
			index: pastIndex
		};
		user.mentor[0].pastMentees.push(mentee);

		//mentor remains "mentor"
		user.mentor[0].mentees.splice(partnerIndex,1);
		user.mentee.splice(partnerIndex,1);
	}

	//save
	user.save(function (err) {
		if (err) {
			console.log(err);
		}
	});
}

// function resetRemindersToSchedule() {}
function sendRemindersToSchedule() {
	var query = userProfile.find({ 'status': 'mentee' });

	query.exec(function (err, foundMentees) {

		var currentDate = Date.now();

		//for each mentee
		for (var i=0; i<foundMentees.length; ++i) {
			//check if reminded already
			if (foundMentees[i].mentee[0].remindedToSchedule) {
				continue;
			}
			//find current event
			for (var j=0; j<foundMentees[i].mentee[0].timeline.length; ++j) {
				//check if, meeting, if its inprogress (status) and if initial (eventStatus)
				if (foundMentees[i].mentee[0].timeline[j].key.slice(4, 11) === 'meeting' && foundMentees[i].mentee[0].timeline[j].status === 'inprogress' && foundMentees[i].mentee[0].timeline[j].eventStatus === 'initial') {

					let bookBy = new Date(); //TODO double check this comparison logic is correct
					bookBy = bookBy.setDate(foundMentees[i].mentee[0].timeline[j].bookByWeek.getDate() - 7).getTime();

					if (currentDate > bookBy) {
						//send email to mentee to remind them to book
						SendAppointmentSchedulingReminderEmail(foundMentees[i], j);
						//set mentee as reminded
						foundMentees[i].mentee[0].remindedToSchedule = true;
						foundMentees[i].save(function (err) {
							if (err) {
								console.log(err);
							}
						});
					}
				}
			}
		}

	});
}
function letBookingWindowsExpire() {
	var query = userProfile.find({ 'status': 'mentee' });

	query.exec(function (err, foundMentees) {

		var currentDate = Date.now();

		//for each mentee
		for (var i=0; i<foundMentees.length; ++i) {
			//find current event
			for (var j=0; j<foundMentees[i].mentee[0].timeline.length; ++j) {
				var timeEvent = foundMentees[i].mentee[0].timeline[j];
				//check if, meeting, if its inprogress (status) and if initial (eventStatus)
				if (timeEvent.key.slice(4, 11) === 'meeting' && timeEvent.status === 'inprogress' && timeEvent.eventStatus === 'initial') {
					letOneBookingWindowExpire(foundMentees[i], j);
				}
			}
		}

	});
}
function letOneBookingWindowExpire(mentee, eventIndex, sendEmail=true) {

	var timeEvent = mentee.mentee[0].timeline[eventIndex];

	let bookBy = timeEvent.bookByWeek.getTime();
	if (currentDate > bookBy) {

		//send email to mentee to remind them to book
		if (sendEmail) {
			SendAppointmentSchedulingExpiredEmail(mentee, eventIndex);
		}
		
		//'complete' appointment
		mentee.mentee[0].remindedToSchedule = false;
		advanceTimeline(mentee, timeEvent.key);
		scheduleChat(mentee.email, mentee.mentor, timeEvent.key, Date.now());

		mentee.save(function (err) {
			if (err) {
				console.log(err);
			}
		});
	}
}

function clearMatchesModels() {
	var currentDate = Date.now();
	var dayLength = 24*60*60*1000;

	mentorshipMatchModel.find({}, function (err, docs) {
		if (err) {
			console.log(err);
			return err;
		}

		for (var i=0; i<docs.length; ++i) {
			var dateComp = (currentDate - docs[i].date)/dayLength;
			if (dateComp > 2) {//expires after 48h


				if (docs[i].token !== null) {

					var approvedMatches = [];
					for (var j=0; j < docs[i].matches.mentors.length; ++j) {
						let mentorMatch = docs[i].matches.mentors[j];
						if (approvedMatches.length < MENTORDISPLAYLIMIT && mentorMatch.request === 'approved') {
							approvedMatches.push(mentorMatch);
						}
					}

					var mentee = docs[i].matches.mentee;

					userProfile.findOne({ 'email': mentee }, function (err, user) {
						if (err || !user) {
							res.send("Error updating account status.");
						}

						if (approvedMatches.length > 0) {
							user.mentee[0].matches = approvedMatches;

							user.save(function (err) {
								if (err) {
									console.log(err);
									return res.send("Error saving in Database.");
								}

								//obscure matches token here to close window of opportunity
								docs[i].expToken = docs[i].token;
								docs[i].token = null;
								docs[i].save(function (err) {
									if (err) {
										console.log(err);
										return res.send("Error saving in Database.");
									}
									revertMentorMatchingState(docs[i], function() {
										SendMatchesNotificationEmail(docs[i]);
									});
								});
							});

						} else {
							let menteeName = user.mentee[0].firstName +" "+ user.mentee[0].lastName;
							docs[i].expToken = docs[i].token;
							docs[i].token = null;
							docs[i].save(function (err) {
								if (err) {
									console.log(err);
									return res.send("Error saving in Database.");
								}
								SendNoMatchesAdminNotificationEmail(docs[i], menteeName);
								SendNoMatchesMenteeNotificationEmail(docs[i], menteeName);
							});
						}
					});
				}

				else if (dateComp > 3) { //then revert mentee seeking; 24h offset allows mentors to be recycled into other mentees' match requests
					var mentee = docs[i].matches.mentee;

					userProfile.findOne({ 'email': mentee }, function (err, user) {
						if (err || !user) {
							res.send("Error updating account status.");
						}

						user.status = 'menteeInTraining';

						user.save(function (err) {
							if (err) {
								console.log(err);
								return res.send("Error saving in Database.");
							}
							docs[i].remove();
						});
					});
				}
			}
		}
	});
}
function revertMentorMatchingState(matchesObject, callback = null, index = 0) {

	if (index < matchesObject.matches.mentors.length) {
		var mentor = matchesObject.matches.mentors[index];

		if (mentor.request !== 'approved') {
			userProfile.findOne({ 'email': mentor.email }, function (err, user) {
				if (err || !user) {
					res.send("Error updating mentor matching state");
				}
				user.mentor[0].matching = false;
				user.save(function (err) {
					if (err) {
						console.log(err);
						return res.send("Error saving in Database.");
					}
					index++;
					revertMentorMatchingState(matchesObject, callback, index);
				});
			});
		}
	}
	else if (callback !== null) {
		return callback();
	}
}

function clearMenteeMatches() {
	var currentDate = Date.now();
	var dayLength = 24*60*60*1000;
	userProfile.find({'status': 'menteeSeeking'}, function(err, users){
		for (let i=0; i<users.length; ++i) {
			mentorshipMatchModel.findOne({ 'matches.mentee': users[i].email }, function (err, doc) {
				var dateComp = (currentDate - doc.date)/dayLength;
				if (dateComp > 7) {
					users[i].status = 'menteeInTraining';
					users[i].save(function (err) {
						if (err) {
							console.log(err);
							return res.send("Error saving in Database.");
						}
						letMenteeMatchesExpireLogic(users[i]);
					});
				}
			});
		}
	});
}
function letMenteeMatchesExpire(mentee) {
	userProfile.findOne({ 'email': mentee }, function (err, user) {
		if (err || !user) {
			res.send("Error updating account status.");
		}

		letMenteeMatchesExpireLogic(user);
	});
}
function letMenteeMatchesExpireLogic(mentee, callback = null, index = 0) {
	if (index < mentee.mentee[0].matches.length) {
		userProfile.findOne({ 'email': mentee.mentee[0].matches[index].email }, function (err, mentor) {
			if (err || !mentor) {
				res.send("Error updating account status.");
			}

			mentor.mentor[0].matching = false;

			mentor.save(function (err) {
				if (err) {
					console.log(err);
					return res.send("Error saving in Database.");
				}
				index++;
				letMenteeMatchesExpireLogic(mentee, callback, index)
			});
		});
	}
	else {
		mentee.mentee[0].matches = [];
		mentee.save(function (err) {
			if (err) {
				console.log(err);
				return res.send("Error saving in Database.");
			}
			destroyMatchesModel(mentee.email, callback);
		});
	}
}
function destroyMatchesModel(menteeEmail, callback = null) {
	mentorshipMatchModel.findOne({ 'matches.mentee': menteeEmail }, function (err, doc) {
		if (err) {
			console.log("Can't find matches instance");
			return res.sendStatus(400);
		}
		doc.remove();
		console.log("removed matches instance of mentee: " + menteeEmail);
		//return res.send("removed matches instance of mentee: " + mentee.email);

		if (callback !== null) {
			return callback();
		}
	});
}


//Check if the session is valid. Redirect to login page if it fails.
function isLoggedIn(req, res, next) {

	if (req.isAuthenticated()) {

		return next();
	}
	console.log("request not authenticated");
	res.send(false);
};
//Reads a specific JSON file and return's a json.
function readJSONFile(filename, callback) {
	fs.readFile(filename, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		try {
			callback(null, JSON.parse(data));
		}
		catch (exception) {

			callback(exception);
		}
	});
};
//Reads a folder and return an array of json files contained in it.
function readJSONFolder(dirname, callback) {
	var files = [];
	var count = 0;
	fs.readdir(dirname, function (err, filenames) {
		if (err) {
			console.log(err);
			return callback(err);
		}
		count = filenames.length;
		filenames.forEach(function (filename) {
			fs.readFile(dirname + filename, function (err, data) {
				if (err) {
					console.log(err);
					return callback(err);;
				}
				try {
					files.push(JSON.parse(data));
					if (files.length === count) {
						return callback(null, files);
					}
					//callback(null, JSON.parse(data));
				}
				catch (exception) {

					callback(exception);
				}
			});
		});
	});
};
//Saves or update a module to the Database. Loaded from JSON.
function saveModuleToDB(fromJSON, callback) {
	moduleModel.findOne({ 'name': fromJSON.name }, function (err, doc) {
		if (err) {
			console.log(err);
			return callback(false);
		}
		if (!doc) {
			var newModule = new moduleModel();
			newModule.name = fromJSON.name;
			newModule.steps = fromJSON.steps;
			newModule.slides = fromJSON.slides;
			newModule.type = fromJSON.type;
			newModule.providedBy = fromJSON.providedBy;
			newModule.save(function (err) {
				if (err) {
					console.log("New module failed to save to DB!");
					return callback(false);
				}
				return callback(true);
			});
		}
		else {
			doc.name = fromJSON.name;
			doc.steps = fromJSON.steps;
			doc.slides = fromJSON.slides;
			doc.type = fromJSON.type;
			doc.providedBy = fromJSON.providedBy;
			doc.save(function (err) {
				if (err) {
					console.log("New module failed to save to DB!");
					return callback(false);
				}
				console.log("Module OVERWRITTEN in DB.");
				return callback(true);
			});
		}
	});
};
//takes a string and returns it in ascii numbers.
function stringToASCII(data) {
	var converted = '';
	for (var i = 0; i < data.length; i++) {
		var asciiThree = ('000' + data.charCodeAt(i)).substr(-3)
		converted = converted.concat(asciiThree);
	}
	return converted;
};
//Takes in ascii code and translate to a string.
function asciiToString(data) {
	var converted = '';
	if (data.length % 3 === 0) {
		for (var i = 0; i < data.length / 3; i++) {
			var charCode = data.substr(i * 3, 3);
			converted = converted.concat(String.fromCharCode(charCode));
		}
		return converted;
	}
	else {
		if (data.length % 3 === 1) {
			data += "00";
		}
		else {
			data += "0";
		}
		for (var i = 0; i < data.length / 3; i++) {
			var charCode = data.substr(i * 3, 3);
			converted = converted.concat(String.fromCharCode(charCode));
		}
		return converted;
		//console.log('invalid ascii format. Must be 3 digits per char.');
	}
};
//Removes the verification tokens after expiry.
function ClearExpiredTokens(callback) {
	verificationTemp.find({}, function (err, docs) {
		var currentTime = new Date();
		var logRemoved = 0;
		for (var i = 0; i < docs.length; i++) {
			if (docs[i].date.getTime() + configParams.tokens.unverified < currentTime) {
				logRemoved++;
				docs[i].remove();
			}
		}
		return callback(logRemoved);
	});
};
//Removes timeStamps that expired from the DB.
function ClearExpiredTimeStamps(callback) {
	timestampModel.find({}, function (err, docs) {
		var currentTime = new Date();
		var logRemoved = 0;
		for (var i = 0; i < docs.length; i++) {
			if (docs[i].date.getTime() + configParams.tokens.chat < currentTime) {
				logRemoved++;
				docs[i].remove();
			}
		}
		return callback(logRemoved);
	});
};
//Removes unverifed accounts after 24H.
function ClearUnverifiedExpiredAccounts(callback) {
	userProfile.find({ 'status': 'unverified' }, function (err, docs) {
		var currentTime = new Date();
		var logRemoved = 0;
		for (var i = 0; i < docs.length; i++) {
			if (docs[i].since.getTime() + configParams.tokens.unverified < currentTime) {
				logRemoved++;
				docs[i].remove();
			}
		}
		return callback(logRemoved);
	});
};
//Calculates the matching score between a mentee and mentor.
function GetMatchScore(mentee, mentor) {
	var matchScore = 0;
	//array holding the result of info matching. 0 = gender, 1 = field, 2 = disabilities.
	var matchingInfo = [false, false, false];

	//Gender Match
	genderLoop://break label
	for (var i = 0; i < mentee.gender.length; i++) {
		for (var j = 0; j < mentor.gender.length; j++) {
			if (mentee.gender[i] === mentor.gender[j]) {
				matchingInfo[0] = true;
				break genderLoop;
			}
		}
	}
	//Field & Study Match
	if (mentee.field === mentor.field) {
		matchingInfo[1] = true;
	}
	else if (mentee.study === mentor.study) {
		matchingInfo[1] = true;
	}
	//Disabilities Match
	disabilityLoop://break label
	for (var i = 0; i < mentee.disabilities.length; i++) {
		for (var j = 0; j < mentor.disabilities.length; j++) {
			if (mentee.disabilities[i] === mentor.disabilities[j]) {
				matchingInfo[2] = true;
				break disabilityLoop;
			}
		}
	}
	//Point system:
	for (var i = 0; i < matchingInfo.length; i++) {
		if (matchingInfo[i])//If the info matches
		{
			switch (mentee.preferences[i]) {
				case 'high': matchScore += 10;
					break;
				case 'low': matchScore += 6;
					break;
				case 'none': matchScore += 4;
					break;
			}
			switch (mentor.bestSuited[i]) {
				case 'high': matchScore += 5;
					break;
				case 'low': matchScore += 3;
					break;
				case 'none': matchScore += 2;
					break;
			}
		}
		else {
			switch (mentee.preferences[i]) {
				case 'high': matchScore -= 6;
					break;
				case 'low': matchScore -= 4;
					break;
				case 'none': matchScore += 0;
					break;
			}
			switch (mentor.bestSuited[i]) {
				case 'high': matchScore -= 3;
					break;
				case 'low': matchScore -= 2;
					break;
				case 'none': matchScore += 0;
					break;
			}
		}
	}
	console.log("Match score: " + matchScore);
	return matchScore;
};
//Verify that the school is included in the list of schools.
function CheckSchoolDomaine(email, callback) {
	readJSONFile(__dirname + '/ContentManager/Resources/Data/schoolEmails.json', function (err, emailList) {
		console.log(err);
		if (err) {
			return callback(false);
		}
		var index = email.indexOf("@");
		var domaine = email.slice(index + 1);
		if (emailList.domaines.indexOf(domaine) === -1) {
			console.log("Email domaine not in list. Invalid school email.");
			return callback(false);
		}
		else {
			console.log("Valid school email.");
			return callback(true);
		}
	});
};
//Generates a random string or x length.
function GenString(StringLength) {
	var generatedString = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < StringLength; i++) {
		generatedString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return generatedString;
};
//returns a random Seed.
function RandomSeed(seed, upperLimit) {
	var x = Math.sin(seed++) * 10000;
	return Math.floor((x - Math.floor(x)) * upperLimit);
};
//Returns the number of new messages per chats and the user's status in the chat.
function GetNewMessageCountAndStatus(mentee, mentor, callingUser, callback) {
	console.log(mentee + " " + mentor);
	GetChatContainer(mentee[0], mentor, -1, function (err, chatCTN) {
		if (err) {
			return err;
		}
		if (!chatCTN) {
			return callback("ERROR: No chat container of that id exists!", null);
		}

		var newMessagesCount = [];
		newMessagesCount.push(0);
		var menteeStatus = [];
		var secondMenteeStatus = [];
		var mentorStatus = [];
		for (var i = 0; i < chatCTN.chats.length; i++) {
			menteeStatus[i] = chatCTN.chats[i].menteeChatStatus;
			mentorStatus[i] = chatCTN.chats[i].mentorChatStatus;
			for (var j = 0; j < chatCTN.chats[i].messages.length; j++) {
				if (chatCTN.chats[i].messages[j].status === 'new' && chatCTN.chats[i].messages[j].sender != callingUser) {
					newMessagesCount[0]++;
				}
			}
		}
		if (mentee.length == 2) {
			GetChatContainer(mentee[0], mentor, -1, function (err, chatCTN) {
				if (err) {
					return err;
				}
				if (!chatCTN) {
					return callback("ERROR: No chat container of that name exists!", null, null);
				}
				newMessagesCount.push(0);
				for (var i = 0; i < chatCTN.chats.length; i++) {
					secondMenteeStatus[i] = chatCTN.chats[i].menteeChatStatus;
					for (var j = 0; j < chatCTN.chats[i].messages.length; j++) {
						if (chatCTN.chats[i].messages[j].status === 'new' && chatCTN.chats[i].messages[j].sender != callingUser) {
							newMessagesCount[1]++;
						}
					}
				}
				return callback(null, newMessagesCount, [menteeStatus, secondMenteeStatus, mentorStatus]);
			});
		}
		else if (mentee.length > 2) {
			return callback("ERROR: Requesting too many mentee chats. MAX 2", null, null);
		}
		else {
			return callback(null, newMessagesCount[0], [menteeStatus, secondMenteeStatus, mentorStatus]);
		}
	});
};
//Returns the Chats attached to a mentor/mentee combo.
function GetChatContainer(mentee, mentor, index, callback) {
	if (typeof index === 'undefined' || index === -1) {
		let isMentee = userIsMentee();
		if (isMentee) {
			index = req.user.mentee[0].pastMentors.length;
			return getChatContainerFromId();
		} else {
			userProfile.findOne({ 'email': mentee }, function (err, acct) {
				if (err) {
					console.log(err);
				} else {
					index = acct.mentee[0].pastMentors.length;
					return getChatContainerFromId();
				}
			});
		}
	}

	function getChatContainerFromId() {
		chatContainer.findOne({ 'chatID': stringToASCII(mentee + mentor + index) }, function (err, chatCTN) {
			if (err) {
				return callback(err, null);
			}
			if (!chatCTN) {
				return callback('Error: No document found!', null);
			}
			return callback(null, chatCTN);
		});
	}
};

//When an admin tryes to edit the website, we also verify if his information matches the DB entry for extra security.
function AdminDBCheck(admin, callback) {
	userProfile.findOne({ 'email': admin.email }, function (err, adminAccount) {
		if (err) {
			return callback(err, false);
		}
		if (adminAccount.status !== 'admin') {
			return callback('Error: Database info does not match request.', false);
		}
		return callback(null, true);
	});
};

function CreateChatContainer(menteeEmail, mentorEmail, callback) {
	GetChatContainer(menteeEmail, mentorEmail, -1, function (err, doc) {
		if (err) {
			console.log('chatContainer count error: ' + err);
			return callback(false);
		}
		if (doc) {
			console.log('Error creating chats. Previously created chat exists: ' + doc);
			return callback(false);
		}


		userProfile.findOne({ 'email': menteeEmail }, function (err, userMentee) {
			var newChatCTN = new chatContainer();
			newChatCTN.chatID = stringToASCII(menteeEmail + mentorEmail + userMentee.mentee[0].pastMentors.length);
			newChatCTN.mentee = menteeEmail;
			newChatCTN.mentor = mentorEmail;


			var generalChat = {
				name: "General",
				key: "std-meeting-0",
				show: true,
				scheduledFor: Date.now(),
				phase: 0,
				order: 0,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: null,
				description: 'This is your general chat for none specific discussions.',
				messages: [{
					sender: "admin",
					content: "Welcome to the general chat!",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat2 = {
				name: "Starting out",
				key: "std-meeting-1",
				show: false,
				scheduledFor: null,
				phase: 1,
				order: 1,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 30,
				description: 'The Starting Out phase involves getting to know each other and building your mentoring relationship. Before you book an appointment and start chatting, we recommend mentors and mentees review the resources provided.',
				messages: [{
					sender: "admin",
					content: "Welcome to starting out.",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat3 = {
				name: "Get going",
				key: "std-meeting-2",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 2,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 45,
				description: 'Phase Two involves working together to identify the mentee’s needs and set smart goals! Use the resources provided and them get going by booking a time to chat!',
				messages: [{
					sender: "admin",
					content: "Welcome get going.",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat4 = {
				name: "MAKING PROGRESS 1",
				key: "std-meeting-3",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 3,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 60,
				description: 'In Phase 3 you will focus on helping each other develop while working through the issues and challenges identified by the mentee! To make progress over this 6-week period, we encourage you to meet at least 3 times to chat.',
				messages: [{
					sender: "admin",
					content: "Welcome to making progress 1",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat5 = {
				name: "MAKING PROGRESS 2",
				key: "std-meeting-4",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 3,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 60,
				description: 'In Phase 3 you will focus on helping each other develop while working through the issues and challenges identified by the mentee! To make progress over this 6-week period, we encourage you to meet at least 3 times to chat.',
				messages: [{
					sender: "admin",
					content: "Welcome to making progress 2",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat6 = {
				name: "MAKING PROGRESS 3",
				key: "std-meeting-5",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 3,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 60,
				description: 'In Phase 3 you will focus on helping each other develop while working through the issues and challenges identified by the mentee! To make progress over this 6-week period, we encourage you to meet at least 3 times to chat.',
				messages: [{
					sender: "admin",
					content: "making progress 3.",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			var chat7 = {
				name: "Evaluating your journey",
				key: "std-meeting-6",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 3,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 60,
				description: 'In Phase Four we encourage you to take some time to talk about your mentoring relationship and what you have learned and the skills you’ve developed. Most importantly, we want you celebrate your successes! To assist you, we’ve provided a few tools.',
				messages: [{
					sender: "admin",
					content: "Evaluating your journey.",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};
			var chat8 = {
				name: "Closing",
				key: "std-meeting-7",
				show: false,
				scheduledFor: null,
				phase: 2,
				order: 3,
				menteeStatus: 'away',
				mentorStatus: 'away',
				duration: 60,
				description: 'The closing phase of the mentoring cycle involves ending of the mentoring relationship and setting new directions! Before you chat to bring closure to your relationship, use the resource provided help you prepare to say goodbye.',
				messages: [{
					sender: "admin",
					content: "The last chat of this program.",
					status: "unread",
					flag: "system",
					'id': 0,
					date: Date.now()
				}]
			};

			newChatCTN.chats.push(generalChat);
			newChatCTN.chats.push(chat2);
			newChatCTN.chats.push(chat3);
			newChatCTN.chats.push(chat4);
			newChatCTN.chats.push(chat5);
			newChatCTN.chats.push(chat6);
			newChatCTN.chats.push(chat7);
			newChatCTN.chats.push(chat8);

			newChatCTN.save(function (err) {
				if (err) {
					return callback(false);
					throw err;
				}
				else {
					console.log('chat create correctly!');
					return callback(true);
				}
			});
		});
	});
};

function AddModulesToProfile(uProfile, callback) {
	console.log("module profile status: ", uProfile.status);
	var modulesToLoad = configParams.moduleLoadout[uProfile.status];
	console.log(modulesToLoad);
	userProfile.findOne({ 'email': uProfile.email }, function (err, doc) {
		if (err || !doc) { return callback(false); }
		for (var i = 0; i < modulesToLoad.length; ++i) {
			var mod = {
				currentSlide: 0,
				completedSlide: 0,
				completed: false,
				name: modulesToLoad[i]
			}
			doc.modules.push(mod);

		}
		doc.markModified('modules');
		doc.save(function (err) {
			if (err) {
				console.log("ERROR: adding modules");
				return callback(false);
			}
			return callback(true);
		});
	});
};

function AddDocumentsToProfile(uProfile, callback) {
	console.log(uProfile);
	if (uProfile.status == undefined || !uProfile) { return callback(false); }
	console.log("documents profile status: ", uProfile.status);
	var documentsToLoad = configParams.documentLoadout[uProfile.status];
	console.log(documentsToLoad);
	userProfile.findOne({ 'email': uProfile.email }, function (err, doc) {
		if (err || !doc) { return callback(false); }
		for (var i = 0; i < documentsToLoad.length; ++i) {
			doc.documents.push(documentsToLoad[i]);
		}
		doc.markModified('documents');
		doc.save(function (err) {
			if (err) {
				console.log("ERROR: adding documents");
				return callback(false);
			}
			return callback(true);
		});
	});
};

function UpdateModuleTimelineEvent(uProfile, module, status, callback) {

	userProfile.findOne({ 'email': uProfile.email }, function (err, user) {
		if (err || !user) {
			console.log("Cannot find userprofile to book an appointment!");
			return callback(false);
		}
		var event;
		if (user.status == 'mentor' || user.status == 'mentorPending' || user.status == 'mentorFull' || user.status == 'mentorInTraining') {
			var i = 0;
			for (; i < user.mentor[0].timeline.length; i++) {
				if (user.mentor[0].timeline[i].module === module) {
					event = user.mentor[0].timeline[i];
					event.status = status;
					//need to make the next one the current event if there are more modules.
					if (configParams.moduleLoadout.mentorInTraining.length - 1 > configParams.moduleLoadout.mentorInTraining.indexOf(module)) {
						var followUpEvent;
						var j = 0;
						for (; j < user.mentor[0].timeline.length; j++) {
							if (user.mentor[0].timeline[j].module ===
								configParams.moduleLoadout.mentorInTraining[configParams.moduleLoadout.mentorInTraining.indexOf(module) + 1]) {
								followUpEvent = user.mentor[0].timeline[j];
								followUpEvent.status = "inprogress";
								break;
							}
						}
						user.mentor[0].timeline.splice(j, 1, followUpEvent);
					}
					//if this was the last module.
					else if (configParams.moduleLoadout.mentorInTraining.length - 1 === configParams.moduleLoadout.mentorInTraining.indexOf(module)) {
						var awaitingApprovalEvent;
						var followUpEvent;
						var trainingEvent;
						var j = 0;
						for (; j < user.mentor[0].timeline.length; j++) {
							if (user.mentor[0].timeline[j].key === 'std-mod-mentor-checklist') {
								followUpEvent = user.mentor[0].timeline[j];
								followUpEvent.status = "completed";
								user.mentor[0].timeline.splice(j, 1, followUpEvent);
							}
							else if (user.mentor[0].timeline[j].key === 'mrk-training') {
								trainingEvent = user.mentor[0].timeline[j];
								trainingEvent.status = "completed";
								user.mentor[0].timeline.splice(j, 1, trainingEvent);
							}
							else if (user.mentor[0].timeline[j].key === 'mrk-approval') {
								awaitingApprovalEvent = user.mentor[0].timeline[j];
								awaitingApprovalEvent.status = "inprogress";
								user.mentor[0].timeline.splice(j, 1, awaitingApprovalEvent);
							}
							else if (user.mentor[0].timeline[j].key === 'std-awaiting-approval') {
								awaitingApprovalEvent = user.mentor[0].timeline[j];
								awaitingApprovalEvent.status = "inprogress";
								user.mentor[0].timeline.splice(j, 1, awaitingApprovalEvent);
							}
						}
					}
					break;
				}
			}
			user.mentor[0].timeline.splice(i, 1, event);
		}
		else if (user.status == 'mentee' || user.status == 'menteeInTraining' || user.status == 'menteeSeeking') {
			var i = 0;
			for (; i < user.mentee[0].timeline.length; i++) {
				if (user.mentee[0].timeline[i].module === module) {
					event = user.mentee[0].timeline[i];
					event.status = status;
					//need to make the next one the current event if there are more modules.
					if (configParams.moduleLoadout.menteeInTraining.length - 1 > configParams.moduleLoadout.menteeInTraining.indexOf(module)) {
						var followUpEvent;
						for (var j = 0; j < user.mentee[0].timeline.length; j++) {
							if (user.mentee[0].timeline[j].module ===
								configParams.moduleLoadout.menteeInTraining[configParams.moduleLoadout.menteeInTraining.indexOf(module) + 1]) {
								followUpEvent = user.mentee[0].timeline[j];
								followUpEvent.status = "inprogress";
								break;
							}
						}
						user.mentee[0].timeline.splice(i, 1, event);
					}
					//if this was the last module.
					else if (configParams.moduleLoadout.menteeInTraining.length - 1 === configParams.moduleLoadout.menteeInTraining.indexOf(module)) {
						var followUpEvent;
						var trainingEvent;
						var requestMentorEvent;
						var matchEvent;
						for (var j = 0; j < user.mentee[0].timeline.length; j++) {
							if (user.mentee[0].timeline[j].key === 'std-mod-mentee-checklist') {
								followUpEvent = user.mentee[0].timeline[j];
								followUpEvent.status = "completed";
								user.mentee[0].timeline.splice(j, 1, followUpEvent);
							}
							else if (user.mentee[0].timeline[j].key === 'mrk-training') {
								trainingEvent = user.mentee[0].timeline[j];
								trainingEvent.status = "completed";
								user.mentee[0].timeline.splice(j, 1, trainingEvent);
							}
							else if (user.mentee[0].timeline[j].key === 'mrk-request-mentor') {
								requestMentorEvent = user.mentee[0].timeline[j];
								requestMentorEvent.status = "inprogress";
								user.mentee[0].timeline.splice(j, 1, requestMentorEvent);
							}
							else if (user.mentee[0].timeline[j].key === 'std-match') {
								matchEvent = user.mentee[0].timeline[j];
								matchEvent.status = "inprogress";
								user.mentee[0].timeline.splice(j, 1, matchEvent);
							}
						}
					}
					break;
				}
			}
			user.mentee[0].timeline.splice(i, 1, event);
		}
		user.save(function (err) {
			if (err) {
				console.log(err);
				console.log("Error Saving event status");
				return callback(false);
			}
			return callback(true);
		});
	});
};

function UpdateTimelineEvent(uProfile, eventKey, status, callback, eventStatus=null) {
	userProfile.findOne({ 'email': uProfile.email }, function (err, user) {
		if (err || !user) {
			console.log("Cannot find userprofile to update the event!");
			return callback(false);
		}
		var event;
		console.log(eventKey);
		if (user.status == 'mentor' || user.status == 'mentorPending' || user.status == 'mentorFull' || user.status == 'mentorInTraining') {
			var i = 0;
			for (; i < user.mentor[0].timeline.length; ++i) {
				if (user.mentor[0].timeline[i].key === eventKey) {
					event = user.mentor[0].timeline[i];
					event.status = status;
					if (eventStatus !== null) {
						event.eventStatus = eventStatus;
					}
					break;
				}
			}
			console.log(event);
			user.mentor[0].timeline.splice(i, 1, event);
		}
		else if (user.status == 'mentee' || user.status == 'menteeInTraining' || user.status == 'menteeSeeking') {
			var i = 0;
			for (; i < user.mentee[0].timeline.length; ++i) {
				if (user.mentee[0].timeline[i].key === eventKey) {
					event = user.mentee[0].timeline[i];
					event.status = status;
					if (eventStatus !== null) {
						event.eventStatus = eventStatus;
					}
					break;
				}
			}
			console.log(event);
			user.mentee[0].timeline.splice(i, 1, event);
		}


		user.save(function (err) {
			if (err) {
				console.log(err);
				console.log("Error Saving event status");
				return callback(false);
			}
			return callback(true);
		});
	});
};

function GetPublicInfoFromUserprofile(email, callback) {
	userProfile.findOne({ 'email': email }, function (err, doc) {
		if (err || !doc) { return callback(false); }
		if (doc.status === "mentee") {
			var editedProfile = {
				picture: doc.picture,
				firstName: doc.mentee[0].firstName,
				lastName: doc.mentee[0].lastName,
				shared: doc.mentee[0].share,
				email: doc.email //this info may not be public, but it's already in scope via userProfile; need it for calendar ><
			};
			return callback(true, editedProfile);
		}
		else if (doc.status === "mentor" || doc.status === "mentorFull") {
			var editedProfile = {
				picture: doc.picture,
				firstName: doc.mentor[0].firstName,
				lastName: doc.mentor[0].lastName,
				shared: doc.mentor[0].share,
				field: doc.mentor[0].currentField,
				highestEducation: doc.mentor[0].highestEducation
			};
			return callback(true, editedProfile);
		}
		return callback(false);
	});
};
//Mark activities as either viewed or archived or both.
function MarkActivity(email, id, viewed, archived) {
	userProfile.findOne({ 'email': email }, function (err, doc) {
		if (err || !doc) { console.log('cannot find activity.'); return; }
		console.log(doc);
		console.log("id : " + id + " viewed: " + viewed + "archived " + archived);
		doc.activities[id].archived = archived;
		doc.activities[id].viewed = viewed;
		doc.markModified('activities');
		doc.save(function (err) {
			if (err) {
				console.log("ERROR: adding documents");
				return;
			}
			console.log("Activity marked correctly.")
			return;
		});
	});
};
//Add a new activity to a user. Activity must contain { title: "", body:"", type: ""} the rest is added here.
function AddActivity(email, activity) {
	userProfile.findOne({ 'email': email }, function (err, doc) {
		if (err || !doc) { console.log("Error finding user to add activity."); return; }
		activity._id = doc.activities.length;
		activity.date = Date.now();
		activity.viewed = false;
		activity.archived = false;
		doc.activities.push(activity);
		doc.save(function (err) {
			if (err) { console.log("Cannot save activity"); return; }
			console.log("New activity saved.");
		});
	});
};
//Send email to mailing list
function SendEmailToList(mail, mailingList) {
	mail.to = configParams.mailingLists[mailingList];
	transporter.sendMail(mail, function (error, info) {
		if (error) {
			console.log(error);
		}
		console.log('Message sent: ' + info.response);
		console.log(info);

	});
};
//Called on the mentee's timeline once matched to set all the dates.
function SetMenteeTimelineDates(uProfile, callback) {
	var currentTime = Date.now();

	var firstSunday = new Date();
	firstSunday.setHours(0);
	firstSunday.setMinutes(0);
	firstSunday.setSeconds(0);
	firstSunday.setMilliseconds(0);
	if (firstSunday.getDay() === 0) {
		console.log("Already Sunday");
	}
	else {
		var daysOff = 7 - firstSunday.getDay();
		firstSunday = addDays(firstSunday, daysOff);
	}
	userProfile.findOne({ 'email': uProfile.email }, function (err, doc) {
		if (err || !doc) { console.log("Error finding user to modify timeline."); return callback(false); }

		for (var i = 0; i < doc.mentee[0].timeline.length; i++) {
			if (doc.mentee[0].timeline[i].bookByWeekBase != null) {

				var event = doc.mentee[0].timeline[i];

				var bookByWeek = new Date(firstSunday);
				bookByWeek.setDate(firstSunday.getDate() + (event.bookByWeekBase * 7));
				event.bookByWeek = bookByWeek;
				console.log(event.bookByWeek);

				doc.mentee[0].timeline.splice(i, 1, event);
			}
		}
		doc.save(function (err) {
			if (err) {
				console.log(err);
				return callback(false);
			}
			return callback(true);
		});
	});

};
//Helper function for setMenteetimelinedates
function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

/*
1)Visits to the website; 					-google
2) number of registered members;			-psdnet
3) number of mentees and mentors;			-psdnet
4) country of visitor; 						-google
5) total unique visitors, 					-google
6) average time spent on the website; 		-google
7) exit and entrance pages
(the pages visitors arrive and leave from); -google
8) bounce rate (# of people who visit
website and immediately leave); 			-google
9)repeat visitors;
10) top internal search keywords			-psdnet
I’ve highlighted -repeat visitors, because I wasn’t sure if it required storage of the IP address?
It would be good for us to also capture location (e.g. province, country). Would this be possible without storing IP unique visitor
Sends back the website's analytics*/
function GetSiteData(callback) {
	//Part one, DB statistics
	console.log("Fetching from user database");
	userProfile.find({}, function (err, docs) {
		if (err || !docs) {
			return callback(false);
		}
		var accounts = {
			mentee: 0,
			menteeSeeking: 0,
			menteeInTraining: 0,
			mentor: 0,
			mentorInTraining: 0,
			mentorPending: 0,
			mentorFull: 0,
			unverified: 0,
			verified: 0,
			admin: 0
		};
		for (var i = 0; i < docs.length; i++) {
			accounts[docs[i].status]++;
		}

		return callback(accounts);
	});
};
