//Mentorship Routes, signup///////////////////////////////////////////////////////
//																				//
//							SIGNUP TO THE PROGRAM 								//
//	 						 													//
//																				//
//////////////////////////////////////////////////////////////////////////////////
const MAXNUMBEROFMENTEESPERMITED = 2;
const TARGETNUMBEROFMENTOR = 5;
const MENTORDISPLAYLIMIT = 3;
//Find matches for a mentee and send request for mentorship to mentors.
router.post('/mentorships/requestMentor', function (req, res) {
	console.log(req.body);
	console.log("User asking for mentor: " + req.user);
	//data.mentee needs to be formated like so
	//$http.post('/mentorships/requestMentor', { $scope.userProfile.mentor[0]})
	var menteeMatchData = {
		gender: req.body.gender,
		field: req.body.currentField,
		study: req.body.study,
		disabilities: req.body.disabilities,
		preferences: req.body.preferences
	}

	var query = userProfile.find({ 'status': 'mentor' });

	query.exec(function (err, foundMentors) {

		if (err) { return next(err); }
		console.log(foundMentors.length);

		var potentialMatches = [];
		var matchScoreResults = [];
		var zippedArray = [];


		for (var i = 0; i < foundMentors.length; i++) {

			//this boolean property pulls a mentor from the pool
			if (foundMentors[i].mentor[0].matching || foundMentors[i].mentor[0].removeFromPool || foundMentors[i].mentor[0].mentees.length >= MAXNUMBEROFMENTEESPERMITED) {
				continue;
			}

			var mentorMatchData = {
				gender: foundMentors[i].mentor[0].gender,
				disabilities: foundMentors[i].mentor[0].disabilities,
				field: foundMentors[i].mentor[0].currentField,
				study: foundMentors[i].mentor[0].study,
				bestSuited: foundMentors[i].mentor[0].bestSuited
			}

			potentialMatches.push(foundMentors[i]);
			matchScoreResults.push(GetMatchScore(menteeMatchData, mentorMatchData));
			console.log("Pushing");
			console.log(i);
		}
		//zipping the arrays
		for (var i = 0; i < potentialMatches.length; i++) {
			zippedArray.push({ score: matchScoreResults[i], match: potentialMatches[i] });
		}

		zippedArray.sort(function (left, right) {
			return right.score - left.score;
		});

		if (zippedArray.length < TARGETNUMBEROFMENTOR) {
			console.log("Low number of mentors available: " + zippedArray.length);
		}

		var mentorMM = new mentorshipMatchModel();
		mentorMM.date = Date.now();
		mentorMM.matches.mentee = req.user.email;
		//list of email receivers
		//var mentorMailList = [];
		var menteeName = req.body.firstName + " " + req.body.lastName;
		//The mentorshipmatchmodel will be searched bassed on this convertedASCII token.
		//Each individual mentors are assigned a unique 3 digit ID. It must be truncated when the request
		//is received to seach the DB.
		var convertedASCII = stringToASCII(menteeName + Date.now().toString());
		mentorMM.matches.token = convertedASCII;

		if (zippedArray.length === 0) {//NO MENTORS!
			console.log("There are NO mentors available for tutoring at the momment.");
			var adminMail = {
				from: 'noreply@psdnet.com', // sender address
				to: [], // list of receivers
				subject: 'No Mentor available for mentee!', // Subject line
				text: 'plain text', // plaintext body
				html: 'A student is looking for a mentor but our database cannot find any available mentor.<br>' +
				req.user.email + ".<br>"
			};
			SendEmailToList(adminMail, 'admin');
			mentorMM.save(function (err) {
				if (err) {
					throw err;
				}
				else {
					userProfile.findOne({ 'email': req.user.email }, function (err, doc) {
						if (err || !doc) {
							res.send("Error updating account status.");
						}
						doc.status = 'menteeSeeking';
						var requestMentorEvent;
						for (var j = 0; j < doc.mentee[0].timeline.length; j++) {
							if (doc.mentee[0].timeline[j].title === 'Request Mentor')//Hacks: if the title changes this breaks.
							{
								requestMentorEvent = doc.mentee[0].timeline[j];
								requestMentorEvent.status = "completed";
								doc.mentee[0].timeline.splice(j, 1, requestMentorEvent);
							}

						}
						doc.save(function (err) {
							if (err) {
								console.log(err);
								return res.send("Error saving in Database.");
							}
							//Sending back the number of mentors that will receive email notification.
							res.send(potentialMatches.length.toString());
						});

					});

				}

			});
		}
		else {
			var menteePackage = {
				'share': req.body.share,
				'study': req.body.study,
			};
			for (var i = 0; i < zippedArray.length && i < TARGETNUMBEROFMENTOR; i++) {
				var uniqueID = ('000' + i).substr(-3);
				//add each potential mentors to the mentormatchModel.
				var mentor = {
					email: zippedArray[i].match.email,
					name: zippedArray[i].match.mentor[0].firstName + " " + zippedArray[i].match.mentor[0].lastName,
					share: zippedArray[i].match.mentor[0].share,
					field: zippedArray[i].match.mentor[0].currentField,
					highestEducation: zippedArray[i].match.mentor[0].highestEducation,
					study: zippedArray[i].match.mentor[0].study,
					picture: zippedArray[i].match.picture,
					id: uniqueID,//adds an identifier for each mentors.
					request: "sent"
				};
				mentorMM.matches.mentors.push(mentor);

				link = "http://" + req.get('host') + "/mentorships/acceptMentee?id=" + convertedASCII;
				SendMenteeBroadcastToMentorsEmail(req, res, mentor, menteePackage, link);

			}
			mentorMM.save(function (err) {
				if (err) {
					throw err;
				}
				else {
					userProfile.findOne({ 'email': req.user.email }, function (err, doc) {
						if (err || !doc) {
							res.send("Error updating account status.");
						}
						doc.status = 'menteeSeeking';
						var requestMentorEvent;
						var matchEvent;
						for (var j = 0; j < doc.mentee[0].timeline.length; j++) {
							if (doc.mentee[0].timeline[j].key === 'mrk-request-mentor') {
								requestMentorEvent = doc.mentee[0].timeline[j];
								requestMentorEvent.status = "completed";
								doc.mentee[0].timeline.splice(j, 1, requestMentorEvent);
							}
							if (doc.mentee[0].timeline[j].key === 'std-match') {
								matchEvent = doc.mentee[0].timeline[j];
								matchEvent.eventStatus = "following";
								doc.mentee[0].timeline.splice(j, 1, matchEvent);
							}
						}
						doc.save(function (err) {
							if (err) {
								console.log(err);
								return res.send("Error saving in Database.");
							}
							//Sending back the number of mentors that will receive email notification.
							res.send(potentialMatches.length.toString());
						});

					});

					for (let i=0; i<mentorMM.matches.mentors.length; ++i) {
						userProfile.findOne({ 'email': mentorMM.matches.mentors[i].email }, function (err, mentor) {
							if (err || !doc) {
								res.send("Error updating account status.");
							}
							mentor.mentor[0].matching = true;
							doc.save(function (err) {
								if (err) {
									console.log(err);
									return res.send("Error saving in Database.");
								}
								//Sending back the number of mentors that will receive email notification.
								res.send(potentialMatches.length.toString());
							});

						});
					}
				}
			});
		}

	});
});
// //route called to received the approved matches.
// router.post('/mentorships/checkAvailable', function (req, res) {
// 	mentorshipMatchModel.findOne({ 'matches.mentee': req.body.email }, function (err, doc) {
// 		if (err) {
// 			console.log(err);
// 			return err;
// 		}
// 		if (!doc) {
// 			console.log('no match');
// 			return res.send({ 'error': 'No matches found. The program coordinator is being notified.' });
// 		}


// 		var approvedMatch = [];
// 		for (var i = 0; i < doc.matches.mentors.length; i++) {
// 			if (doc.matches.mentors[i].request === "approved") {
// 				approvedMatch.push(doc.matches.mentors[i]);
// 			}
// 		}
// 		res.send(approvedMatch);
// 	});
// });
//route called when a mentor want to accept a mentee's request for mentorship.
router.get('/mentorships/setMentorAcceptingMentees', function (req, res) {
	userProfile.findOneAndUpdate({ 'email': req.user.email }, {
		"$set": {
			"mentor.$.removeFromPool": req.body.removeFromPool
		}
	}, function (err, doc) {
		if (err) {
			return err;
		}
	});
});
router.get('/mentorships/acceptMentee', function (req, res) {
	host = req.get('host');
	if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
		console.log("Domain is matched. Information is from Authentic email");

		var reqID = req.query.id;
		var uniqueID = reqID.substr(reqID.length - 3);//retrieving the mentor's unique ID
		reqID = reqID.slice(0, -3);//Isolating the token.

		mentorshipMatchModel.findOne({ 'matches.token': reqID }, function (err, doc) {

			if (err) {
				return err;
			}
			if (!doc) {
				res.send("invalid Link or Token expired.");
				return;
			}

			for (var i = 0; i < doc.matches.mentors.length; i++) {

				if (uniqueID === doc.matches.mentors[i].id) {
					//not an elegant solution. Replacing the whole array so it gets updated.
					doc.matches.mentors[i].request = "approved";
					var updatedMatch = {
						request: "approved",
						id: doc.matches.mentors[i].id,
						picture: doc.matches.mentors[i].picture,
						highestEducation: doc.matches.mentors[i].highestEducation,
						field: doc.matches.mentors[i].field,
						share: doc.matches.mentors[i].share,
						name: doc.matches.mentors[i].name,
						study: doc.matches.mentors[i].study,
						email: doc.matches.mentors[i].email
					};
					doc.matches.mentors.splice(i, 1, updatedMatch);

				}
			}

			doc.save();

			res.send("<h3 style='text-align:center;'>Thank you for your interest in this mentorship opportunity!</h3><br>" +
				"<button style='text-align:center;' type='button'" + "onclick='window.close();'>Close</button>");
		});
	}
	else {
		res.send("<h1>Request is from unknown source");
	}
});
//called from the matches page. Once the mentee is sure of the mentor they pick this routes gets called.
//it assigns both the mentee to the mentor and vice versa.
router.post('/mentorships/selectMentor', function (req, res) {
	var menteeUpdated = false;
	var mentorUpdated = false;
	if (!req.user) { return res.sendStatus(401); }
	userProfile.findOneAndUpdate({ 'email': req.user.email }, {
		"$set": {
			"mentee.$.mentor": req.body.mentor
		}
	}, function (err, doc) {

		if (err) {
			return err;
		}
		if (doc) {//chaging the mentee's status from menteeSeeking to mentee.

			doc.status = 'mentee';
			doc.dateMatched = Date.now();

			doc.save(function (err) {
				if (err) {
					console.log(err);
				}
				//Update the mentee's deadline for booking appointments.
				SetMenteeTimelineDates(req.user, function (success) {
					//set the mentee's first appointment as inprogress.
					UpdateTimelineEvent(req.user, 'std-meeting-1', 'inprogress', function (success) {
						UpdateTimelineEvent(req.user, 'std-match', 'completed', function (success) {
							UpdateTimelineEvent(req.user, 'mrk-16-week-curriculum', 'inprogress', function (success) {
								UpdateTimelineEvent(req.user, 'mrk-phase-1', 'inprogress', function (success) {

								});
							});
						});
					});
				});

				//clearing and returning other matches to pool
				letMenteeMatchesExpireLogic(doc);

				userProfile.findOneAndUpdate({ 'email': req.body.mentor }, {
					"$addToSet": {
						"mentor.$.mentees": req.user.email
					}
				}, function (err, mentorDoc) {
					if (err) {
						console.log(err);
					}

					SendMentorChosenByMenteeEmail(req, res, mentorDoc);

					CreateChatContainer(req.user.email, req.body.mentor, function (reply) {
						res.send('mentee info updated:' + menteeUpdated + ". " + " mentor info updated:" + mentorUpdated + '. Chat created: ' + reply);
					});
				});
			});
		}
	});

});

router.post('/mentorships/passCompletionMessage', function (req, res) {
	var query = { 'email': req.user.email };
	userProfile.findOne(query, function (err, user) {

		var isMentor;
		switch (user.status) {
			case 'menteeInTraining':
				isMentor = false;
				break;
			case 'mentor':
				isMentor = true;
				break;
		}

		if (isMentor) {
			user.mentor[0].completionMessage = false;
		} else {
			user.mentee[0].completionMessage = false;
			//resetting timeline:
			for (let i=0; i<user.mentee[0].timeline.length; ++i) {
				var eventKey = user.mentee[0].timeline[i].key;
				var status, eventStatus = null;
				switch (eventKey) {
					case 'mrk-application':
					case 'std-joining':
					case 'std-verify':
					case 'mrk-training':
					case 'std-mod-mentee-1':
					case 'std-mod-mentee-2':
					case 'std-mod-mentee-3':
					case 'std-mod-mentee-4':
					case 'mrk-before':
					case 'std-declaration':
					case 'std-admin-approval':
					case 'mrk-request-mentor':
					case 'mrk-match':
						status = 'completed';
						break;

					case 'mrk-16-week-curriculum':
					case 'mrk-phase-1':
					case 'std-meeting-1':
						status = 'inprogress';
						break;

					default:
						status = 'upcoming';
						switch (eventKey) {
							case 'std-meeting-1':
							case 'std-meeting-2':
							case 'std-meeting-3':
							case 'std-meeting-4':
							case 'std-meeting-5':
							case 'std-meeting-6':
							case 'std-meeting-7':
								eventStatus = 'initial';
						}
				}
				UpdateTimelineEvent(user, eventKey, status, function (success) {
					console.log('saved? ' + success);
				}, eventStatus);
			}
		}

		user.save(function (err) {
			if (err) {
				console.log(err);
				return res.send({ 'status': false });
			}
			return res.send({ 'status': true });
		});
	});
});

router.post('/mentorships/viewMenteeTimeline', function (req, res) {
	//to view mentee's timeline
});
router.post('/mentorships/renewMentorship', function (req, res) {
	//for allowing mentee to request mentor after curriculum end

	//send email to notify mentor of request
	//allow 1 week's time for mentor to respond
	//if mentor agrees, revert mentee timeline to post-match state
	//else revert mentee to post-training, ready to request new mentor
});
router.post('/mentorships/closeRelationship', function (req, res) {
	//for releasing relationship from userProfile to make room for another

	//remove all menotorship-related tabs except mentorshipTab itself, retaining all modules/documents encountered through program
	//mentee is ready to request new mentor
});

//Mentorship Routes, interactions/////////////////////////////////////////////////
//																				//
//							For Mentor/mentee interarctions,					//
//	 						 training and communications.						//
//																				//
//////////////////////////////////////////////////////////////////////////////////
//Called from the mentee's side to comfirm booking of a time slot for appointment.
router.post('/mentorships/bookAppointment', function (req, res) {
	if (!req.user || req.user.status != 'mentee') {//Only the mentee can book appointments.
		return res.sendStatus(401);
	}

	userProfile.findOne({ 'email': req.user.email }, function (err, userMentee) {
		if (err || !userMentee) {
			console.log("Cannot find userprofile to book an appointment!");
			return res.sendStatus(400);
		}

		var ap = req.body.event;
		var mentorEmail = userMentee.mentee[0].mentor;

		var eventIndex;
		for (var i = 0; i < userMentee.mentee[0].timeline.length; ++i) {
			if (userMentee.mentee[0].timeline[i].id == req.body.event.id) {
				eventIndex = i;
				break;
			}
		}
		userMentee.mentee[0].timeline.splice(eventIndex, 1, ap);
		//userMentee.mentee[0].timeline.push(ap);
		//Saving to mentee's timeline.
		userMentee.save(function (err) {
			if (err) {
				console.log("Error Saving mentee appointment");
			}
			console.log("Saved Appointment for mentee");

			//sending email to mentor
			SendAppointmentScheduledEmail(req, res, ap);

			//change the chat's status
			scheduleChat(req.user.email, mentorEmail, req.body.event.key, req.body.event.start, function(err) {
				if (err) {
					res.send(false);
				} else {
					res.send(true);
				}
			});

			//Adding activity to mentee feed.
			//AddActivity(req.user.email, {title: "Appointment Booked!", body: JSON.stringify(ap), type: "appointment" });

			/*userProfile.findOne({'email': req.user.mentee[0].mentor}, function(err, userMentor){
				if(err || !userMentor){
					console.log("Cannot find userprofile to book an appointment!");
					return res.sendStatus(400);
				}
				userMentor.mentor[0].timeline.splice(req.body.event.id, 1, ap);
				//userMentor.mentor[0].timeline.push(ap);
				//saving to mentor's timeline.
				userMentor.save(function(err){
					if(err){
						console.log("Error Saving mentor appointment");
					}
					//Adding activity to mentor feed.
					AddActivity(req.user.mentee[0].mentor, {title: "Appointment Booked!", body: JSON.stringify(ap), type: "appointment" });
					console.log("Saved Appointment for mentor");
					res.send(true);
				});
			});*/

		});
	});
});
//Called from the mentee's side to cancel appointment. User will need to reschedule.
router.post('/mentorships/cancelAppointment', function (req, res) {

	var isMentee = userIsMentee();
	var email;
	if (isMentee) {
		email = req.user.email;
	} else {
		email = req.body.event.menteeEmail;
	}

	userProfile.findOne({ 'email': email }, function (err, mentee) {
		if (err) {
			console.log("Cannot find userprofile to cancel an appointment!");
			return res.sendStatus(400);
		}

		var ap = req.body.event;

		var eventIndex;
		for (var i = 0; i < mentee.mentee[0].timeline.length; ++i) {
			if (mentee.mentee[0].timeline[i].id == ap.id) {
				eventIndex = i;
				break;
			}
		}

		ap.eventStatus = 'initial';
	    var index = eventObj.activity.map(function(e){return e.type;}).indexOf("chat");
	    if (index >= 0) {
	       eventObj.activity.splice(index, 1);
        }
		mentee.mentee[0].timeline.splice(eventIndex, 1, ap);

		//Saving to user's timeline.
		mentee.save(function (err) {
			if (err) {
				console.log("Error Saving mentee appointment");
			}
			console.log("Cancelled Appointment for mentee");

			if (isMentee) {
				//mentee is cancelling, so send to mentor > false
				SendCancelledAppointmentEmail(req, res, mentee, ap, false);
			} else {
				SendCancelledAppointmentEmail(req, res, mentee, ap, true);
			}

			letOneBookingWindowExpire(mentee, eventIndex, false);

			res.send(true);
		});
	});
});
//returns up to 6 random mentors for display on pages. The randomness is seeded per day.
router.get('/mentor/randomSample', function (req, res) {
	curratedModel.find({}, function (err, docs) {
		var dayOfTheMonth = new Date().getDate();
		var sampleArray = [];
		console.log(docs);
		if (docs.length < 6) {
			for (var i = 0; i < docs.length; i++) {
				var mentor = docs[i];
				delete mentor.email;
				sampleArray.push(mentor);
			}
			return res.send(sampleArray);
		}
		var arrayPOS = [];
		var indexFinder = 0;
		for (var i = 0; i < 6; i++) {

			var index = RandomSeed(dayOfTheMonth + i + indexFinder, docs.length);
			if (arrayPOS.indexOf(index) === -1) {
				var mentor = docs[i];
				delete mentor.email;
				sampleArray.push(mentor);
				arrayPOS.push(index);
			}
			else {
				i--;
				indexFinder++;
			}

		}


		return res.send(sampleArray);
	});
});
//Get the shared info of a mentor/mentee
router.post('/matched/getinfo', function (req, res) {
	if (!req.user) { return res.sendStatus(401); }

	if (req.user.status == "mentee") {
		GetPublicInfoFromUserprofile(req.user.mentee[0].mentor, function (success, info) {
			if (success) {
				return res.send(info);
			}
		});
	}
	else if (req.user.status == "mentor" || req.user.status == "mentorFull") {
		console.log("Fetching mentees");
		var arrayToReturn = [];
		GetPublicInfoFromUserprofile(req.user.mentor[0].mentees[0], function (success, info) {
			if (success) {

				arrayToReturn.push(info);
				console.log(arrayToReturn);
				if (req.user.mentor[0].mentees.length > arrayToReturn.length) {
					GetPublicInfoFromUserprofile(req.user.mentor[0].mentees[arrayToReturn.length], function (success, info2) {
						if (success) {
							arrayToReturn.push(info2);

						}
						else {
							return res.sendStatus(400);
						}
						return res.send(arrayToReturn);
					});
				}
				else {
					return res.send(arrayToReturn);
				}

			}
			else {
				return res.sendStatus(400);
			}
		});
	}
});
//Timeline Routes ////////////////////////////////////////////////////////////////
//																				//
//							Timeline events 									//
//	 						 													//
//																				//
//////////////////////////////////////////////////////////////////////////////////
//Updates
router.post('timeline/updateEvent', function (req, res) {
	if (!req.user) { return res.sendStatus(401); }


});