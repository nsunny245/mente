//Content Manager routes//////////////////////////////////////////////////////////
//																				//
//																				//
//	 	Manages routes to post, update or change the site from admin login.		//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	//Sets the database's modules in line with the json files.
	//For deloyment or hard reset.

	router.post('/contentManager/testLoadCMS', function(req, res) {
		butter.post.list({page: 1, page_size: 10}).then(function(response) {
  			return res.send(response);
		})
	})

	
	router.get('/contentManager/loadModulesFromJSON', function(req,res){
		if(!req.user || req.user.status !== 'admin'){ return res.sendStatus(401);}//Cannot use if not logged in as admin
		AdminDBCheck(req.user, function(err, sucess){//double security check wrapper.
			readJSONFolder(__dirname + '/ContentManager/Resources/Modules/', function (err, loadedJSONs) {
				if(err){
					console.log(err);
					return res.sendStatus(400);
				}
				var moduleProccessed = 0;
				var moduleSaved = 0;
				for(var i = 0; i < loadedJSONs.length; i++){
					saveModuleToDB(loadedJSONs[i], function(succes){
						if(succes){
							moduleSaved++;
						}
						moduleProccessed++;
						if(moduleProccessed === loadedJSONs.length)
						{
							res.send("Uploaded : " + moduleSaved +" of " + loadedJSONs.length + " modules from JSONs.");
						}
					});
				}
			});
		});

	});
 	////routes to retrieve messages from the contentManager model saved.
	router.get('/contentManager/retrieveMessages', function(req, res){
		var query = contentManagerModel.find({}).select({"_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/about', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.about": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/chat', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.chat": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/community', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.community": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/contact', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.contact": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/education', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.education": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/evaluation', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.evaluation": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/featured', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.featured": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/forum', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.forum": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/home', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.home": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/login', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.login": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/mentor', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.mentor": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/mentorship', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.mentorship": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/news', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.news": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/3pillars', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.pillars": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/podcasts', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.podcasts": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/profile', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.profile": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/signup', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.signup": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/timeline', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.timeline": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/training', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.training": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/webinars', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.webinars": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	//
	router.get('/contentManger/optInMentorProfiles', function(req,res){
		userProfile.find({$or :[{'status': 'mentor'}, {'status': 'mentorFull'}]}, function(err, docs){
			var optedIn = [];
			for(var i = 0; i < docs.length; i++)
			{
				if(docs[i].mentor[0].shareProfileOptIn)
				{
					optedIn.push(docs[i]);
				}
			}
			res.send(optedIn);
		});
	});
	router.get('/contentManager/featuredMentors', function (req,res) {
		curratedModel.find({}, function(err, docs){
			if(err){
				return res.send("Error accessing the database.");
			}
			if(!docs){
				return res.send("No featured mentor saved on the DB.");
			}
			return res.send(docs);
		});
	});
	router.post('/contentManager/addCurrated', function(req,res){
		curratedModel.findOne({'email': req.body.email}, function(err, doc){
			if(err){
				return res.send("Error accessing the database.");
			}
			if(doc){
				console.log(doc);
				return res.send("This user is already in the currated list.");
			}
			var newlyCurrated = new curratedModel();
			newlyCurrated.picture = req.body.picture;
			newlyCurrated.fullName = req.body.fullName;
			newlyCurrated.share = req.body.share;
			newlyCurrated.why = req.body.why;
			newlyCurrated.highestEducation = req.body.highestEducation;
			newlyCurrated.currentField = req.body.currentField;
			newlyCurrated.numberOfYearsInField = req.body.numberOfYearsInField;
			newlyCurrated.other = req.body.other;
			newlyCurrated.updatedOn = new Date();
			newlyCurrated.email = req.body.email;
			newlyCurrated.save(function(err){
				if(err){
					return res.send("Error saving new featured user!");
				}
				return res.send("New featured mentor saved correctly!");
			});
		});

	});
	router.post('/contentManager/removeCurrated', function(req, res){
		console.log(req.body);
		curratedModel.findOne({'email': req.body.email}, function(err, doc){
			if(err){
				return res.send("Error accessing the DB!");
			}
			if(!doc){
				return res.send("Cannot find user in the DB. Profile not removed/not found.");
			}
			doc.remove();
			res.send("User removed from DB.");
		});
	});
	//Creates a new contentManager model on the database if none exists.
	//Need to also update the data if one is found.
	router.post('/contentManager/UpdateMessages', function(req, res){

		contentManagerModel.count( function(err, count){
			if(err){ return err;}

			var firstCMModel = new contentManagerModel();

			if(count === 1)
			{
				console.log('Updating entry');
				//make our model a json object and delete the _id field so we can update.
				var updatingData = firstCMModel.toObject();
				delete updatingData._id;
				updatingData.pages = req.body;
				contentManagerModel.update({}, updatingData, function(err, numberAffected, rawResponse) {
				   //handle it
				   if(err)
				   {
				   	res.send("ERROR:  " + err.toString());
				   }
				   else
				   {
				   	res.send("successfully updated the doc.");
				   }
				});

			}
			else
			{
				res.send("ERROR UPDATING contentManager. Count shows too many entries.");
			}
		});
	});
	router.post('/contentManager/loadMessagesFromJSON', function(req, res){

		contentManagerModel.count( function(err, count){
			if(err){ return err;}

			var firstCMModel = new contentManagerModel();

			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_login.json', function (err, msg_login) {
				if(err){ throw err; }
				firstCMModel.pages.login = msg_login;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_pillars.json', function (err, json_pillars) {
				if(err){ throw err; }
				firstCMModel.pages.pillars = json_pillars;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_about.json', function (err, json_about) {
				if(err){ throw err; }
				firstCMModel.pages.about = json_about;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_contact.json', function (err, json_contact) {
				if(err){ throw err; }
				firstCMModel.pages.contact = json_contact;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_community.json', function (err, json_community) {
				if(err){ throw err; }
				firstCMModel.pages.community = json_community;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_forum.json', function (err, json_forum) {
				if(err){ throw err; }
				firstCMModel.pages.forum = json_forum;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_profile.json', function (err, json_profile) {
				if(err){ throw err; }
				firstCMModel.pages.profile = json_profile;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_education.json', function (err, json_education) {
				if(err){ throw err; }
				firstCMModel.pages.education = json_education;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_news.json', function (err, json_news) {
				if(err){ throw err; }
				firstCMModel.pages.news = json_news;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_podcasts.json', function (err, json_podcasts) {
				if(err){ throw err; }
				firstCMModel.pages.podcasts = json_podcasts;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_webinars.json', function (err, json_webinars) {
				if(err){ throw err; }
				firstCMModel.pages.webinars = json_webinars;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_featured.json', function (err, json_featured) {
				if(err){ throw err; }
				firstCMModel.pages.featured = json_featured;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_chat.json', function (err, json_chat) {
				if(err){ throw err; }
				firstCMModel.pages.chat = json_chat;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_evaluation.json', function (err, json_evaluation) {
				if(err){ throw err; }
				firstCMModel.pages.evaluation = json_evaluation;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_mentor.json', function (err, json_mentor) {
				if(err){ throw err; }
				firstCMModel.pages.mentor = json_mentor;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_mentorship.json', function (err, json_mentorship) {
				if(err){ throw err; }
				firstCMModel.pages.mentorship = json_mentorship;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_signup.json', function (err, json_signup) {
				if(err){ throw err; }
				firstCMModel.pages.signup = json_signup;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_timeline.json', function (err, json_timeline) {
				if(err){ throw err; }
				firstCMModel.pages.timeline = json_timeline;
			});
			readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_training.json', function (err, json_training) {
				if(err){ throw err; }
				firstCMModel.pages.training = json_training;
			//this is INSIDE the last readJSON function. Need to figure a better way to do this as async issues are very likely.

			if(count === 0)
			{
				firstCMModel.save(function(err){
					if(err)
					{
						throw err;
					}
					else
					{
						res.send("First upload of messages documents.");
						return (null, firstCMModel);
					}
				});
			}
			else if(count === 1)
			{
				contentManagerModel.find().remove(function(err){
					if(err){
						console.log(err);
					}
					firstCMModel.save(function(err){
						if(err)
						{
							throw err;
						}
						else
						{
							res.send("FILES OVERWRITTEN!");
							return (null, firstCMModel);
						}
					});
				});
			}


		});

		});
	});
	//Loads the timeline from the DataBase. ADMIN
	router.post('/contentManager/timeline/loadDefault', function(req,res){
		if(!req.user){ return res.sendStatus(401);}
		AdminDBCheck(req.user, function(err, success){
			if(!success|| err){
				return res.sendStatus(401);
			}
			var entryName = "default";
			switch(req.body.type){
				case "mentee":
					entryName = "defaultMenteeTimeline";
					break;
				case "mentor":
					entryName = "defaultMentorTimeline";
					break;
			}
			timelineModel.findOne({"_id": entryName}, function(err, doc){
				if(err){
					return res.send({"error": "Error loading from DB.", "document":  null});
				}
				if(!doc){
					return res.send({"error": "No document found.", "document":  null});
				}
				return res.send({"error": null, "document":  doc});
			});

		});
	});
	//save the timeline in the DataBadse. ADMIN
	router.post('/contentManager/timeline/saveDefault', function(req,res){
		if(!req.user){ return res.sendStatus(401);}
		AdminDBCheck(req.user, function(err, success){
			if(!success|| err){
				return res.sendStatus(401);
			}
			var idTag = '';
			switch(req.body.timeline.timelineType){
				case "mentee": idTag = "defaultMenteeTimeline";
				break;
				case "mentor": idTag = "defaultMentorTimeline";
				break;
			}

			var editedTimeline = new timelineModel();
			delete editedTimeline._id;
			editedTimeline.timelineType = req.body.timeline.timelineType;
			editedTimeline.startDate = new Date();
			editedTimeline.offsetInDays = 0;
			for(var i = 0; i < req.body.timeline.events.length; i++){
				editedTimeline.events.push(req.body.timeline.events[i]);
			}
			console.log(editedTimeline);
			timelineModel.update({_id: idTag}, editedTimeline, {upsert: true}, function(err){
				if(err){
					return res.send(err);
				}
				return res.send("Successfully updated");
			});
		});
	});
	//Load the timeline from preset JSON. ADMIN
	router.post('/contentManager/timeline/loadFromJSON', function(req,res){
		if(!req.user){ return res.sendStatus(401); }
		AdminDBCheck(req.user, function(err, success){
			if(!success|| err){
				return res.sendStatus(401);
			}
			var idTag = '';
			var filename = '';
			switch(req.body.timelineType){
				case "mentee": 	idTag = "defaultMenteeTimeline";
								filename = 'timelineMentee.json';
				break;
				case "mentor": 	idTag = "defaultMentorTimeline";
								filename = 'timelineMentor.json';
				break;
			}
			readJSONFile(__dirname + '/ContentManager/Resources/Data/' + filename, function (err, loadedJSON) {
				if(err){ return res.send(err); }
				var resetDoc = new timelineModel();
				resetDoc._id = idTag;
				resetDoc.timelineType = loadedJSON.timelineType;
				resetDoc.startDate = new Date();
				resetDoc.offsetInDays = 0;
				for(var i = 0; i < loadedJSON.events.length; i++){
					resetDoc.events.push(loadedJSON.events[i]);
				}
				timelineModel.findOne({ '_id' : idTag }, function(err, doc){
					if(err){ return res.sendStatus(400); }
					if(!doc){
						resetDoc.save(function(err){
							return res.send("New document added.");
						});

					}
					else{
						doc.startDate = loadedJSON.startDate;
						doc.events = loadedJSON.events;
						doc.save(function(err){
							return res.send("Document reset!");
						});
					}
				});
			});
		});
	});