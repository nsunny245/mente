//Admin Routes ///////////////////////////////////////////////////////////////////
//																				//
//							BANS, ACCOUNT REVIEWS ETC							//
//	 						 													//
//																				//
//////////////////////////////////////////////////////////////////////////////////
function AdminConfirm(req, res, action) {
	if (!req.user) { return res.sendStatus(401); }
	AdminDBCheck(req.user, function (err, success) {//Admin check against the database.
		if (!success || err) {
			return res.sendStatus(401);
		}
		action();
	})
}
//accountRevokeTemplate

router.post('/admin/accounts/getAllUsers', function (req, res) {
	AdminConfirm(req, res, function () {
		userProfile.find(function (err, docs) {
			if (err) {
				console.log("could not find users");
			} else {
				res.send(docs);
			}
		});
	});
});

router.post('/admin/accounts/approveUsername', function (req, res) {
	//approve the username for user, sets the value to true so you will not see it again once signed off
	AdminConfirm(req, res, function () {
		userProfile.findOneAndUpdate({ 'email': req.body.email }, {
			$set: {
				isUsernameApproved: true
			}
		}, function (err, doc) {
			if (err) {
				console.log('cannot find  user profile');
				return res.sendStatus(400);
			} else {
				console.log('approved username ' + req.body.username);
				res.send("approved username: " + req.body.username);
			}
		})
	})
})

router.post('/admin/accounts/deleteUser', function (req, res) {
	//remove a user, and send them an email about their account being deleted
	AdminConfirm(req, res, function () {
		removeProfile(req, res, function () {
			SendUserRevokeEmail();
		});
	});
});

//Loads the list of mentors awaiting manual review for approval.
router.post('/admin/accounts/pendingMentors', function (req, res) {

	if (!req.user) { return res.sendStatus(401); }
	AdminDBCheck(req.user, function (err, success) {//Admin check against the database.
		if (!success || err) {
			return res.sendStatus(401);
		}
		userProfile.find({ 'status': 'mentorPending' }, function (err, docs) {
			console.log(err);
			console.log(docs);
			if (err) { res.sendStatus(400); }
			res.send(docs);
		});
	});
});

//admins emails for mentee
router.post('/admin/accounts/approveMentee', function (req, res) {
	//gets called from the admin user panel
	//get details of mentee and then mark them as approved by admin
	AdminConfirm(req, res, function () {
		userProfile.findOneAndUpdate({ 'email': req.body.email }, {
			$set: {
				"mentee.$.approvedByAdmin": true
			}
		}, function (err, user) {
			if (err) {
				return err;
			}

			let userName = user.mentee[0].firstName +' '+ user.mentee[0].lastName;
			let userEmail = user.email;
			let awaitingApproval = user.mentee[0].trainingCompleted;
			SendMenteeHasBeenApprovedEmail(req, res, userName, userEmail, awaitingApproval);

			user.save(function (err) {
				if (err) {
					console.log(err);
					return res.send({ 'status': false });
				}
				if (user.mentee[0].declarationsMade) {
					UpdateTimelineEvent(user, 'mrk-before', 'completed', function (success) {
						UpdateTimelineEvent(user, 'std-admin-approval', 'completed', function (success) {
							UpdateTimelineEvent(user, 'mrk-request-mentor', 'inprogress', function (success) {
								UpdateTimelineEvent(user, 'std-match', 'inprogress', function (success) {
									res.sendStatus(200);
									console.log("updated timeline");
								});
							});
						});
					});
				}
			});
		});
	});
})

//Approves a mentor and set his/her status to mentor (fully ready.)
//From then on these mentors will be added to the search pool for new mentorships.
router.post('/admin/accounts/approveMentor', function (req, res) {
	if (!req.user) { return res.sendStatus(401); }
	AdminDBCheck(req.user, function (err, success) {//admin check against the database.
		if (!success || err) {
			return res.sendStatus(401);
		}
		userProfile.findOne({ 'email': req.body.approvedMentor }, function (err, doc) {
			console.log(err);
			console.log(doc);
			if (err) { res.sendStatus(400); }
			doc.status = 'mentor';//Assign the mentor title to the mentorPending - this status is deprecated mentorInTraining > mentor

			let userName = user.mentor[0].firstName +' '+ user.mentor[0].lastName;
			let userEmail = user.email;
			SendMentorHasBeenApprovedEmail(req, res, userName, userEmail);

			doc.save(function (err) {

				if (err) { console.log(err); }
				//TODO : SEND EMAIL congratulating the user for getting approved to the mentorship.
				//Update the mentor's timeline
				UpdateTimelineEvent(doc, 'mrk-approval', 'completed', function (success) {
					UpdateTimelineEvent(doc, 'std-awaiting-approval', 'completed', function (success) {
						UpdateTimelineEvent(doc, 'mrk-match', 'inprogress', function (success) {
							UpdateTimelineEvent(doc, 'std-matching', 'inprogress', function (success) {
								res.sendStatus(200);
							});
						});
					});
				});
			});

		});
	});
});
//Get a list of posts flaged by users.
router.post('/contentManager/forum/getFlagged', function (req, res) {
	if (!req.user) { return res.sendStatus(401); }
	AdminDBCheck(req.user, function (err, success) {//admin check against the database.
		if (!success || err) {
			return res.sendStatus(401);
		}
		forumPost.find({}, function (err, docs) {
			var reportedPosts = [];
			for (var i = 0; i < docs.length; ++i) {
				if (docs[i].reports.length > 0) {
					reportedPosts.push(docs[i]);
				}
			}
			return res.send(reportedPosts);

		});

	});
});
//Delete the post (this cannot be undone)
router.post('/contentManager/forum/deletePost', function (req, res) {
	if (!req.user) { return res.sendStatus(401); }
	AdminDBCheck(req.user, function (err, success) {//admin check against the database.
		if (!success || err) {
			return res.sendStatus(401);
		}
		forumPost.findOne({ "_id": req.body._id }, function (err, doc) {
			if (err || !doc) {
				return res.sendStatus(400);
			}
			doc.remove(function (err) {
				if (err) { return res.sendStatus(400); }
				return res.send(true);
			});

		});

	});
});


