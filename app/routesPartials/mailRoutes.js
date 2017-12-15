//Mail routes/////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 		Used to send email comfirmations and reminder/notifications.		//
//																				//
//////////////////////////////////////////////////////////////////////////////////

//this route is for when you are sending feedback - feedback email
router.post('/sendFeedback', function (req, res) {
	if (!req.body.feedback) {
		console.log("bad feedback: " + req.body.feedback);
		return res.sendStatus(400);
	}
	if (!req.body.email) {
		req.email = "generalfeedback@psdnet.com"
	}
	SendFeedbackEmail(req, function (x, error) {
		if (error) {
			return res.sendStatus(400);
		} else if (x) {
			return res.sendStatus(200);
		}
	});
});

function sourceVerify(runFunc, req, res) {
	//just a confirmation that you are who you say you are
	host = req.get('host');
	console.log(req);
	if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
		console.log("Domain is matched. Information is from Authentic email");
		verificationTemp.findOne({ 'linkID': req.query.id }, function (err, temp) {
			if (err) {
				return err;
			}
			if (!temp) {
				return res.send("invalid Link or Token expired.");
			}
			runFunc(temp);
		})
	} else {
		res.send("Request is from unknown source");
	}
}

router.get('/mail/verify', function (req, res) {
	//need to validate user account here. Removal will be automated after 24h.
	sourceVerify(function (temp) {
		userProfile.findOneAndUpdate({ 'email': temp.email }, {
			$set: {
				'status': 'verified'
			}
		}, function (err, numberAffected, rawResponse) {
			if (err) {
				console.log("ERROR:  " + err.toString());
				res.send("<head><meta http-equiv='refresh' content='5;url=http://" + host + "/#/signup/mentorship' /></head><h3 style='text-align:center;'>This account has already been verified!</h3>");
			}
			else {
				console.log("successfully updated the doc. " + numberAffected);
				res.send("<head><meta http-equiv='refresh' content='5;url=http://" + host + "/#/signup/mentorship' /></head><h3 style='text-align:center;'>Congratulations, your email has been verified.<br>You will be redirected momentarily.</h3>");
			}

		});
	}, req, res);
});

router.get('/mail/verifySchool', function (req, res) {
	sourceVerify(function (temp) {
		userProfile.findOneAndUpdate({ 'email': temp.user.email }, {
			$set: {
				"mentee.$.schoolEmailVerified": true
			}
		}, function (err, doc) {

			if (err) {
				return err;
			}

			SendMenteeAdminApproveEmail(temp, res, function () {
				console.log("done email sent admin");
			}, temp.host);

			res.send("<head><meta http-equiv='refresh' content='5;url=http://" + host + "/#/profile/timeline' /></head><h3 style='text-align:center;'>Congratulations, you have successfully verified your mentorship account with your school email.<br>You will be redirected momentarily.</h3>");

			//update timeline
			doc.save(function (err) {
				if (err) { console.log(err); }
				//TODO : SEND EMAIL congratulating the user for getting approved to the mentorship.
				UpdateTimelineEvent(doc, 'std-verify', 'completed', function (success) {
					UpdateTimelineEvent(doc, 'mrk-training', 'inprogress', function (success) {
						UpdateTimelineEvent(doc, 'std-mod-mentee-1', 'inprogress', function (success) {
							UpdateTimelineEvent(doc, 'std-mod-mentee-2', 'upcoming', function (success) {
								console.log("updated timline?");
							});
						});
					});
				});
			});


		})
	}, req, res);
})


router.post('/mail/sendSchoolVerification', function (req, res) {
	if (!req.user) {
		return res.sendStatus(401);
	}
	SendSchoolEmailToken(req, res, function (emailres) {
		if (emailres.status) {
			return res.send(emailres);
		} else {
			return console.log("error sending school email token!");
		}
	});
	// SendSchoolEmailToken(req, function(res, err){
	// 	if(res){
	// 		console.log("Success");
	// 	}
	// 	else{
	// 		console.log(err);
	// 	}
	// });
});


//admins emails for mentee
router.get('/adminMail/adminApproveMentor', function (req, res) {
	sourceVerify(function (temp) {
		userProfile.findOneAndUpdate({ 'email': temp.user.email }, {
			$set: {
				"mentor.$.approvedByAdmin": true
			}
		}, function (err, user) {

			if (err) {
				return err;
			}
			res.send("<head><meta http-equiv='refresh'>Congratulations, you have successfully verified this mentor account.<br>You will be redirected momentarily.</h3>");

			console.log("ADMIN APPROVE Db RETURN ----------------------------------------------------------", user);

			user.save(function (err) {
				if (err) {
					console.log(err);
					///return res.send({ 'status': false });
				}
				UpdateTimelineEvent(user, 'mrk-application', 'completed', function (success) {
					UpdateTimelineEvent(user, 'std-awaiting-approval', 'completed', function (success) {
						UpdateTimelineEvent(user, 'mrk-training', 'inprogress', function (success) {
							UpdateTimelineEvent(user, 'std-mod-mentor-1', 'inprogress', function (success) {
								console.log("updated timline?");
							});
						});
					});
				});
				//return res.send({ 'status': true });
			});
		});
	}, req, res);
});





//admins emails for mentee
router.get('/adminMail/adminApproveMentee', function (req, res) {
	sourceVerify(function (temp) {
		userProfile.findOneAndUpdate({ 'email': temp.user.email }, {
			$set: {
				"mentee.$.approvedByAdmin": true
			}
		}, function (err, user) {

			if (err) {
				return err;
			}
			res.send("<head><meta http-equiv='refresh'>Congratulations, you have successfully verified this mentee account.<br>You will be redirected momentarily.</h3>");

			console.log("ADMIN APPROVE Db RETURN ----------------------------------------------------------", user);

			user.save(function (err) {
				if (err) {
					console.log(err);
					///return res.send({ 'status': false });
				}
				if (user.mentee[0].declarationsMade) {
					UpdateTimelineEvent(user, 'mrk-before', 'completed', function (success) {
						UpdateTimelineEvent(user, 'std-admin-approval', 'completed', function (success) {
							UpdateTimelineEvent(user, 'mrk-request-mentor', 'inprogress', function (success) {
								UpdateTimelineEvent(user, 'std-match', 'inprogress', function (success) {
									console.log("updated timline?");
								});
							});
						});
					});
				}
				//return res.send({ 'status': true });
			});
		});
	}, req, res);
});


//the route that an admin calls by clicking a unique link from the user list. It sends more detailed information about the selected user
router.get('/adminMail/sendUserToAdmin', function (req, res) {
	sourceVerify(function (temp) {
		//once the source is verified, send the user info email to admin
		SendUserInfoEmailToAdmin(temp, res, function () {
			console.log("user info email sent to admin!");
		}, temp.host);
		res.send("<head><meta http-equiv='refresh'>You be recieving an email with more details shortly</h3>");
	}, req, res);
})

//sub functions of the user info email

//from the email the admin can delete a user, this route is called from the user email. The data comes from SendUserInfoEmailToAdmin()
router.get('/adminMail/deleteUser', function (req, res) {
	sourceVerify(function (temp) {
		//once verified, deleted the specified profile
		removeProfile(temp, res);
	}, req, res);
})

