//Signup routes///////////////////////////////////////////////////////////////////
//																				//
//																				//
//				 Used for signups/creating new users 							//
//																				//
//////////////////////////////////////////////////////////////////////////////////
//Signup to become a normal user for the site. Also first step to mentorship.
router.post('/signup', function (req, res, next) {
	console.log("Signing up");
	passport.authenticate('local-signup', function (err, user, info) {
		console.log(err + user + info);
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send({ status: false, error: "This email has already been used to create an account" });
		}
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			SendConfEmail(req, res, function (emailres) {
				return res.send({ status: true, error: null });
			});
		});
	})(req, res, next);
});
//Signup to become a mentee
router.post('/signup/menteeForm', function (req, res) {
	//console.log(req.user);
	if (!req.user) {
		//not logged in
		return res.sendStatus(401);
	}
	var query = {
		'email': req.user.email
	};
	//need to add all the received data here.
	var menteeObject = {
		_id: 0,
		schoolName: req.body.schoolName,
		schoolEmail: req.body.schoolEmail,
		schoolEmailVerified: false,
		firstName: req.body.firstName,
		middleName: req.body.middleName,
		lastName: req.body.lastName,
		gender: req.body.gender,
		age: req.body.age,
		study: req.body.study,
		biggestChallenge: req.body.biggestChallenge,
		isCurrentlyInMentorship: req.body.isCurrentlyInMentorship,
		currentlyInMentorshipDetails: req.body.currentlyInMentorshipDetails,
		isCommit: req.body.isCommit,
		share: req.body.share,
		disabilities: req.body.disabilities,
		preferences: req.body.preferences,
		currentField: req.body.currentField,
		why: req.body.why,
		//admin section below.
		approvedByAdmin: false,
		trainingCompleted: false,
		declarationsMade: false,
		completedProgram: false,
		completionMessage: false,
		matches: [],
		remindedToSchedule: false,
		mentor: "",
		pastMentors: []
	};
	var statusCompletion = "verified";
	if (req.body.completed) {
		statusCompletion = "menteeInTraining";
	}

	userProfile.update(query, { $pull: { 'mentee': { '_id': 0 } }, $set: { 'status': statusCompletion } },
		function (err, numberAffected, rawResponse) {
			//handle it
			if (err) {
				console.log("ERROR:  " + err.toString());
			}
			userProfile.update(query, { $push: { 'mentee': menteeObject } }, function (err, num, raw) {
				if (err) {
					console.log("ERROR:  " + err.toString());
				}
				else {
					if (req.body.completed) {
						timeline.genTimeline("mentee", function (timeline) {
							userProfile.findOneAndUpdate({ 'email': req.user.email, 'mentee._id': 0 }, {
								"$set": {
									"mentee.0.timeline": timeline
								}
							}, { upsert: true, new: true }, function (err, doc) {
								if (err) {
									console.log("ERROR UPDATING ", err);
									return err;
								} else {
									if (!doc) {
										console.log("doc is not present");
										return 0;
									}

									AddModulesToProfile(doc, function (emailres) {
										if (emailres) {
											console.log(emailres);
										} else {
											console.log("intro email not sent properly");
										}

										SendMenteeIntroContentEmail(req, res, function (emailres) {
											if (emailres.status) {
												console.log("sent mentee intro email");
												console.log(emailres);
											} else {
												//console.log("email not sent properly");
											}
										});

										SendSchoolEmailToken(req, res, function (emailres) {
											if (emailres.status) {
												console.log("sent mentee school token email");
												console.log(emailres);
											} else {
												//console.log("email not sent properly");
											}
										});

										AddDocumentsToProfile(doc, function (success) {
											if (!success) {
												console.log("could not add documents to mentee");
											}
											res.sendStatus(200);
										});
										//good to go
									});
								}
							});
						});

						/*CheckSchoolDomaine(req.body.schoolEmail, function (isValid) {
							if (isValid) {
								var verfificationData = {
					email: req.user.email,
					schoolEmail: req.body.schoolEmail,
					username: req.user.username,
					host: req.get('host')
				};
				SendSchoolEmailToken(verfificationData, function (success) {
					if (success) {
						console.log("Yes success");
						res.send(true);
					}
					else {
						console.log("email error");
						res.send(true);
					}
				});
			}
			else {
				console.log("School email is not in the list");
			}
		});*/
					}
					console.log("successfully updated the doc after mentee signup. " + numberAffected);
				}
			});
		});
});


//TODO doesn't work; change to Mongo's own promise method
//dbUpdatePromise.then(function (doc) {
//Add the modules here:
// 	console.log("AFTER SIGNUP THE DOC IS ", doc)
// 	AddModulesToProfile(req, function (success) {
// 		if (!success) {
// 			console.log("could not add modules to mentee");
// 		}
// 		SendMenteeIntroContentEmail(req, res, function (emailres) {
// 			if (emailres) {
// 				console.log(emailres);
// 			} else {
// 				console.log("intro email not sent properly");
// 			}
// 		});
// 		SendSchoolEmailToken(req, res, function (emailres) {
// 			if (emailres) {
// 				console.log(emailres);
// 			} else {
// 				console.log("school email not sent properly");
// 			}
// 		});
// 		AddDocumentsToProfile(doc, function (success) {
// 			if (!success) {
// 				console.log("could not add documents to mentee");
// 			} else {
// 				res.sendStatus(200);
// 			}
// 		});
// 	})
// })
//})



/*CheckSchoolDomaine(req.body.schoolEmail, function (isValid) {
	if (isValid) {
		var verfificationData = {
			email: req.user.email,
			schoolEmail: req.body.schoolEmail,
			username: req.user.username,
			host: req.get('host')
		};
		SendSchoolEmailToken(verfificationData, function (success) {
			if (success) {
				console.log("Yes success");
				res.send(true);
			}
			else {
				console.log("email error");
				res.send(true);
			}
		});
	}
	else {
		console.log("School email is not in the list");
	}
});*/

//Signup to become a mentor.
router.post('/signup/mentorForm', function (req, res) {
	if (!req.user) {
		return res.send("Not logged in.");
	}
	if (req.user.status != 'verified') {
		return res.send("wrong account status:" + req.user.status);
	}
	var query = {
		'email': req.user.email
	};
	var availObj = [
		[],
		[],
		[],
		[],
		[],
		[],
		[]
	];
	for (var i = 0; i < 7; i++) {
		for (var j = 0; j < 3; j++) {
			availObj[i].push({
				'available': false,
				'start': null
			});
		}
	}
	//need to add all the received data here.
	var mentorObject = {
		_id: 0,
		workEmail: req.body.workEmail,
		preferredEmail: req.body.preferredEmail,
		phone: req.body.phone,
		firstName: req.body.firstName,
		middleName: req.body.middleName,
		lastName: req.body.lastName,
		gender: req.body.gender,
		age: req.body.age,
		isGraduate: req.body.isGraduate,
		highestEducation: req.body.highestEducation,
		schoolType: req.body.schoolType,
		study: req.body.study,
		currentField: req.body.currentField,
		numberOfYearsInField: req.body.numberOfYearsInField,
		why: req.body.why,
		isCurrentlyInMentorship: req.body.isCurrentlyInMentorship,
		currentlyInMentorshipDetails: req.body.currentlyInMentorshipDetails,
		gain: req.body.gain,
		gainMentee: req.body.gainMentee,
		isCommit: req.body.isCommit,
		share: req.body.share,
		disabilities: req.body.disabilities,
		bestSuited: req.body.bestSuited,
		//admin section below.
		trainingCompleted: false,
		declarationsMade: false,
		matching: false,
		completedProgram: false,
		completionMessage: false,

		removeFromPool: false,
		numberOfMentees: 0,
		mentees: [],
		pastMentees: [],
		timeline: [],
		availabilityReminder: "monthly",
		availability: availObj,
		isPoliceChecked: false,
		policeCheck: '',
		shareProfileOptIn: req.body.shareProfileOptIn,
		shareProfileOptIn: req.body.references
	};
	var statusCompletion = "verified";
	if (req.body.completed) {
		//TODO Uncomment below and link to modules
		statusCompletion = "mentorInTraining";
	}
	let dbUpdatePromise = new Promise(function (resolve, reject) {
		userProfile.update(query, {
			$pull: {
				'mentor': {
					'_id': 0
				}
			},
			$set: {
				'status': statusCompletion
			}
		}, function (err, numberAffected, rawResponse) {
			if (err) {
				console.log("ERROR:  " + err.toString());
			}
			userProfile.update(query, {
				$push: {
					'mentor': mentorObject
				}
			}, function (err, doc) {
				if (err) {
					console.log("ERROR:  " + err.toString());
				} else {
					if (req.body.completed) {
						timeline.genTimeline("mentor", function (timeline) {
							userProfile.findOneAndUpdate({
								'email': req.user.email
							}, {
									"$set": {
										"mentor.$.timeline": timeline
									}
								}, function (err, doc) {
									if (err) {
										return err;
									}
									console.log("successfully updated the doc after mentor signup. " + numberAffected);
									resolve(doc);
								})
						})
					}
				}
			});
		});
	});
	dbUpdatePromise.then(function (doc) {
		SendMentorAdminApproveEmail(req, res, function (emailres) {
			console.log("done email sent admin mentor --------------------------------------------------------->>>> :)");
		});
		console.log("after SendMentorAdminApproveEmail --------------------------------------------------------->>>> :)");
		//Add the modules here:
		AddModulesToProfile(doc, function (success) {
			if (!success) {
				console.log("could not add modules to mentor");
			}
			AddDocumentsToProfile(doc, function (success) {
				if (!success) {
					console.log("could not add documents to mentor");
				} else {
					res.sendStatus(200);
				}
			});
		});
		console.log("after AddModulesToProfile --------------------------------------------------------->>>> :)");
		SendMentorIntroContentEmail(req, res, function (emailres) {
			if (emailres.status) {
				console.log(emailres);
			} else {
				console.log("email not sent properly MENTOR");
			}
		});
		console.log("after sendintromentoremail --------------------------------------------------------->>>> :)");
		//good to go
	}).catch(function (reason) {
		console.log("MENTOR UPDATE DB ERR: ", reason);
	})
})


router.post('/mentorship/completeTraining', function (req, res) {
	if (!req.user) {
		return res.send({ 'message': 'Currently not logged' });
	}
	var query = { 'email': req.user.email };

	userProfile.findOne(query, function (err, user) {
		if (err) {
			console.log(err);
			return res.send(404);
		}

		if (user.status === 'menteeInTraining') {
			user.mentee[0].trainingCompleted = true;
		} else if (user.status === 'mentorInTraining') {
			user.mentor[0].trainingCompleted = true;
		} else {
			console.log('invalid profile to complete training');
			return res.sendStatus(401);
		}
		user.save(function (err) {
			if (err) {
				console.log(err);
				return res.send({ 'status': false });
			}
			//TODO : SEND EMAIL congratulating the user for getting approved to the mentorship.
			UpdateTimelineEvent(user, 'mrk-before', 'inprogress', function (success) {
				UpdateTimelineEvent(user, 'std-declaration', 'inprogress', function (success) {
					console.log("updated timline?");
				});
			});
			return res.send({ 'status': true });
		});
	});
});
router.post('/mentorship/makeDeclarations', function (req, res) {
	if (!req.user) {
		return res.send({ 'message': 'Currently not logged' });
	}
	var query = { 'email': req.user.email };

	userProfile.findOne(query, function (err, user) {
		if (err) {
			console.log(err);
			return res.sendStatus(404);
		}

		if (user.status === 'menteeInTraining') {
			user.mentee[0].declarationsMade = true;
		} else if (user.status === 'mentorInTraining') {
			user.status = 'mentor';
			user.mentor[0].declarationsMade = true;
		} else {
			console.log('invalid profile to make declarations');
			return res.sendStatus(401);
		}
		user.save(function (err) {
			if (err) {
				console.log(err);
				return res.sendStatus(401);
			}
			UpdateTimelineEvent(user, 'std-declaration', 'completed', function (success) {
				if (user.status === 'menteeInTraining') {
					if (user.mentee[0].approvedByAdmin) {
						UpdateTimelineEvent(user, 'mrk-before', 'completed', function (success) {
							UpdateTimelineEvent(user, 'std-admin-approval', 'completed', function (success) {
								UpdateTimelineEvent(user, 'mrk-request-mentor', 'inprogress', function (success) {
									UpdateTimelineEvent(user, 'std-match', 'inprogress', function (success) {
										console.log("updated timline?");
									});
								});
							});
						});
					} else {
						UpdateTimelineEvent(user, 'std-admin-approval', 'inprogress', function (success) {
							console.log("updated timline?");
						});
					}
				} else {
					UpdateTimelineEvent(user, 'mrk-before', 'completed', function (success) {
						UpdateTimelineEvent(user, 'mrk-request-mentor', 'inprogress', function (success) {
							UpdateTimelineEvent(user, 'std-match', 'inprogress', function (success) {
								console.log("updated timline?");
							});
						});
					});
				}
			});
			return res.sendStatus(200);
		});
	});
});

//This checks if the user has verified their email and appends the mentee/mentor object based on their choice.
router.post('/signup/checkVerified', function (req, res) {
	if (!req.user) {
		return res.send({ 'message': 'Currently not logged' });
	}
	if (req.user.status === 'unverified') {
		var currentTime = new Date();
		var logRemaining = (req.user.since.getTime() + configParams.tokens.unverified) - currentTime;
		if (logRemaining > 0) {
			return res.send({ 'message': "Your email has not been verified! Please check you email for verification. Token will expire in ", 'time': logRemaining });
		}
		else {
			ClearExpiredTokens(function (count) {
				ClearUnverifiedExpiredAccounts(function (count) {
					return res.send({ 'message': 'temporary token as expired.' });
				});
			});
		}
	}
	else {
		res.send({ 'status': req.user.status });
	}
});
//Send the comfirmation email to the user. They are required to click a link to verify their account.
router.post('/signup/SendConfEmail', function (req, res) {
	if (!req.user) {
		return res.sendStatus(401);
	}
	SendConfEmail(req, res, function (emailres) {
		res.send(emailres);
	});
});