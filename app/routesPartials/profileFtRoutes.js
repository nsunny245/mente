//File transfer/Profile Update routes/////////////////////////////////////////////
//																				//
//																				//
//	 Used for uploading profile picture, police check and maybe more.			//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	//Called from the settings page. Updates the user info on the DB.
		var diff = require('deep-diff').diff;
		var observableDiff = require('deep-diff').observableDiff,
		applyChange = require('deep-diff').applyChange;

		function extend (target) {
		for(var i=1; i<arguments.length; ++i) {
			var from = arguments[i];
			if(typeof from !== 'object') continue;
			for(var j in from) {
				if(from.hasOwnProperty(j)) {
					target[j] = typeof from[j]==='object'
					? extend({}, target[j], from[j])
					: from[j];
				}
			}
		}
		return target;
	}

	//check password / confirm password

	router.post('/confirmPassword', function (req, res, next) {
			passport.authenticate('chat-login', function (err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res.send(false);
				}
				return res.send(true);
			})(req, res, next);
		});


	router.post('/update/profile', function (req, res, next) {
		console.log(req.body.updatedProfile);
		// console.log(req.user.password);
		if (!req.user) {
			return res.sendStatus(401);
		}
		passport.authenticate('chat-login', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.send(false);
			}

			if (req.user.status === 'mentor') {
				userProfile.update({ 'email': req.user.email }, {
					$set: {
						'mentor.0': req.body.updatedProfile
					}
				}, function (err, doc) {
					if (err) {
						return res.send("Error accessing the DB.");
					}
					if (!doc) {
						return res.send("Error : no user found.");
					}
				});
			} else if (req.user.status === 'mentee') {
				userProfile.update({ 'email': req.user.email }, {
					$set: {
						'mentee.0': req.body.updatedProfile
					}
				}, function (err, doc) {
					if (err) {
						return res.send("Error accessing the DB.");
					}
					if (!doc) {
						return res.send("Error : no user found.");
					}
				})
			};
			})(req, res, next);
	});
	//Changes the profile picture of the user.
	router.post('/upload/picture', function(req,res){

		var query = {'email':req.user.email};


		userProfile.update(query, {$set: { 'picture': req.body.encodedImage }}, function(err, numberAffected, rawResponse) {
			   //handle it
			   if(err)
			   {
			   	console.log("ERROR:  " + err.toString());
			   }
			   else
			   {
			   	console.log("successfully updated the doc. " + numberAffected);
			   }
			});
	});
	//Dead route atm. Was going to be use to store pdf on mongo DB (police checks)
	router.post('/upload/pdf', function(req,res){
		console.log(req.body);
		var query = {'email':req.user.email};
		userProfile.findOne(query, function(err, found){
			console.log(found);

			var tempMentor = found.mentor[0];
			tempMentor.mentor.policeCheck = req.body.pdfResults;


			userProfile.update(query, {$pop: {'mentor': -1 }}, function(err, numberAffected, rawResponse) {
				if(err)
				{
					console.log("ERROR:  " + err.toString());
					res.send(err);
				}
				else
				{
					userProfile.update(query, {$push: { 'mentor': tempMentor }} , function(err, numberAffected, rawResponse) {
						if(err)
						{
							console.log("ERROR:  " + err.toString());
							res.send(err);
						}
						else
						{
							res.send(tempMentor.mentor.policeCheck);
						}
					});
				}
			});
		});
	});
	//Routes to get/add/remove documents to your list of documents.
	//They are display on the mentorship tab of the profile dashboard.
	router.post('/documents/getinfo', function(req, res){//returns the links
		if (!req.user) {
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email }, function(err, doc){
			if(err || !doc){
				return res.sendStatus(400);
			}
			var documentArray = [];

			var userIsMentee;
			switch (req.user.status) {
				case 'menteeInTraining':
				case 'menteeSeeking':
				case 'mentee':
					userIsMentee = true;
					break;
				case 'mentorInTraining':
				case 'mentorPending':
				case 'mentor':
					userIsMentee = false;
					break;
				default:
					return res.sendStatus(400);
			}
			var completedProgram;
			if (userIsMentee) {
				var timeline = req.user.mentee[0].timeline;
				completedProgram = req.user.mentee[0].completedProgram;
			} else {
				timeline = req.user.mentor[0].timeline
				completedProgram = req.user.mentor[0].completedProgram;
			}
			for (var i=0; i<timeline.length; i++) {
				if (! completedProgram && timeline[i].status == 'upcoming') {
					break;
				}
				var activity = timeline[i].activity;
				for (var j=0; j<activity.length; j++) {
					var newRes;
					if (activity[j].type == 'doclink' || activity[j].type == 'link' && !activity[j].name.match(/\(Module\)$/)) {
						newRes = {
							'title': activity[j].name,
							'source': activity[j].link,
							'phase': timeline[i].phase,
							'content': timeline[i].content
						};
						documentArray.push(newRes);
					}
				}
			}
			// for(var i = 0; i < doc.documents.length; ++i)
			// {
			// 	var newdoc = {
			// 		title: configParams.documentlinks[doc.documents[i]].title,
			// 		content: configParams.documentlinks[doc.documents[i]].description,
			// 		source: configParams.documentlinks[doc.documents[i]].link
			// 	};
			// 	documentArray.push(newdoc);
			// }

			return res.send(documentArray);
		});
	});
	router.post('/modules/getinfo', function(req, res){//returns the modules
		if (!req.user) {
			console.log('no user');
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email }, function(err, doc){
			if(err || !doc){
				console.log('user error');
				return res.sendStatus(400);
			}
			var moduleArray = [];

			var userIsMentee;
			switch (req.user.status) {
				case 'menteeInTraining':
				case 'menteeSeeking':
				case 'mentee':
					userIsMentee = true;
					break;
				case 'mentorInTraining':
				case 'mentorPending':
				case 'mentor':
					userIsMentee = false;
					break;
				default:
					return res.sendStatus(400);
			}
			var completedProgram;
			if (userIsMentee) {
				var timeline = req.user.mentee[0].timeline;
				completedProgram = req.user.mentee[0].completedProgram;
			} else {
				timeline = req.user.mentor[0].timeline
				completedProgram = req.user.mentor[0].completedProgram;
			}
			for (var i=0; i<timeline.length; i++) {
				if (! completedProgram && timeline[i].status == 'upcoming') {
					break;
				}
				var activity = timeline[i].activity;
				for (var j=0; j<activity.length; j++) {
					var newMod;
					if (activity[j].type == 'link' && activity[j].name.match(/\(Module\)$/)) {
						newMod = {
							'title': activity[j].name,
							'source': activity[j].link,
							'phase': timeline[i].phase,
							'content': timeline[i].content
						};
						moduleArray.push(newMod);
					}
				}
			}
			// for(var i = 0; i < doc.documents.length; ++i)
			// {
			// 	var newdoc = {
			// 		title: configParams.documentlinks[doc.documents[i]].title,
			// 		content: configParams.documentlinks[doc.documents[i]].description,
			// 		source: configParams.documentlinks[doc.documents[i]].link
			// 	};
			// 	documentArray.push(newdoc);
			// }

			return res.send(moduleArray);
		});
	});
	router.post('/documents/add', function(req, res){//adds to the userprofile
		if (!req.user) {
			return res.sendStatus(401);
		}
		userProfile.findOneAndUpdate({'email': req.user.email},{
				"$addToSet": {
					"documents": req.body.document
				}
			}, function(err, doc){
				if(err)
				{
					return res.sendStatus(400);
				}
				return res.sendStatus(200);

			});
	});
	/*DISABLED UNTIL NEEDED
	router.post('/documents/remove', function(req, res){//removes from the userprofile
		if (!req.user) {
			return res.sendStatus(401);
		}
		userProfile.findOneAndUpdate({'email': req.user.email},{
				"$pull": {
					"documents": req.body.document
				}
			}, function(err, doc){
				if(err)
				{
					return res.sendStatus(400);
				}
				return res.sendStatus(200);

			});
	});*/
	router.post('/activity/mark', function(req,res){
		if(!req.user){
			return res.sendStatus(401);
		}
		MarkActivity(req.user.email, req.body.id, req.body.viewed, req.body.archived);
	});

	router.post('/removeOwnProfile', function (req, res) {
		if(!req.user){
			return res.sendStatus(401);
		}
		removeProfile(req, res, function(){
			SendOwnAccountDeletedEmail();
		});
	});