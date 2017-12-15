//Calendar routes/////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 																			//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	router.post('/contentManager/loadCalendarEventsFromJSON', function(req, res){
		calendarModel.count( function(err, count){
			if(err){ throw err; }

			var calCMModel = new calendarModel();
			readJSONFile(__dirname + '/ContentManager/Resources/Calendar/master_calendar_2016.json', function (err, json_calendarEvent) {
				if(err){ throw err; }
				calCMModel.events = json_calendarEvent.events;
				calCMModel.uniqueID = json_calendarEvent.year;
				console.log(json_calendarEvent);
				if(count === 0) {
					calCMModel.save(function(err){
						if(err) {
							throw err;
						} else {
							res.send("First upload of messages documents.");
						}
					});
				} else if(count === 1) {
					calendarModel.find().remove(function(err){
						if(err){
							throw err;
						}
						calCMModel.save(function(err){
							if(err) {
								throw err;
							} else {
								res.send("FILES OVERWRITTEN!");
							}
						});
					});
				}
			});

		});
	});
	router.post('/contentManager/loadCalendarEvents', function(req, res){
			calendarModel.findOne({uniqueID:req.body.ID}, function(err, document){
				res.send(document);
			});
	});
	router.post('/contentManager/updateCalendar', function(req, res){
		calendarModel.count( function(err, count){
			if(err){ return err;}

			var firstCalModel = new contentManagerModel();

			if(count === 1)
			{
				console.log('Updating Calendar');
				//make our model a json object and delete the year field so we can update.
				var updatingCal = firstCalModel.toObject();//make json into an Bson object
				delete updatingCal._id;
				updatingCal.events = req.body;
				calendarModel.update({}, updatingCal, function(err, numberAffected, rawResponse) {
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
				res.send("ERROR UPDATING Calendar. Count shows too many entries.");
			}
		});
	});
	router.post('/contentManager/loadTandCFromJSON', function (req, res) {
		termsAndConditionsModel.count(function (err, count) {
			if (err) { throw err; }


			var tmModel = new termsAndConditionsModel();
			readJSONFile(__dirname + '/ContentManager/Resources/TermsAndConditions/TandC.json', function (err, json_tc) {
				console.log(json_tc);
				tmModel.tcObj = json_tc.tcObj;
				if(count === 0) {
					tmModel.save(function(err){
						if(err) {
							throw err;
						} else {
							res.send("First upload of documents.");
						}
					});
				} else if(count === 1) {
					termsAndConditionsModel.find().remove(function(err){
						if(err){
							throw err;
						}
						tmModel.save(function(err){
							if(err) {
								throw err;
							} else {
								res.send("FILES OVERWRITTEN!");
							}
						});
					});
				}
			});
			});
		});

		router.post('/contentManager/loadTc', function(req, res){
			termsAndConditionsModel.find({}, function(err, document){
				console.log(req.body);
				console.log(document[0]);
				res.send(document[0].tcObj[req.body.tcType]);
			})
	});
	router.post('/calendar/load', function(req,res){//To load a personal calendar, must specify if its a mentee or mentor requesting.

		if(!req.user){return res.sendStatus(401);}
		calendarModel.findOne({uniqueID: 'main'}, function(err,mainCal){
			if(!mainCal || err){
				return res.sendStatus(400);
			}
			return res.send(mainCal);
		});
	});
	router.post('/calendar/SendIcalLink', function (req, res) {//router for ical
		if (!req.user) {
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email}, function(err, doc){
			SendIcalLink(req, function(emailres){
				if(err || !doc){
					return res.sendStatus(400);
				}
				console.log("RUN SENDICAL " + req.body.event.id);


				var event = req.body.event;
				event.ical = emailres;

		});
		});
	});
	router.post('/calendar/SendIcalCancel', function (req, res) {//router for ical
		if (!req.user) {
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email}, function(err, doc){
			SendIcalLink(req, function(emailres){
				if(err || !doc){
					return res.sendStatus(400);
				}
				console.log("RUN SENDICAL " + req.body.event.id);


				var event = req.body.event;
				event.ical = emailres;

		});
		});
	});

	router.post('/mentor/saveAvailability', function(req,res){
		if(!req.user || req.user.status != 'mentor'){
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email}, function(err, doc){
			if(err || !doc){
				return res.sendStatus(400);
			}
			doc.mentor[0].availability = req.body;
          	doc.save(function(err){
          		if(err){return res.sendStatus(400);}
				res.send(true);
          	});

		});
	});
	router.post('/mentor/editBlockedAdded', function(req,res){
		console.log(req.body);
		if(!req.user || req.user.status != 'mentor'){
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email}, function(err, doc){
			if(err || !doc){
				return res.sendStatus(400);
			}
			if(req.body.blockedDates){
				doc.mentor[0].blockedDates = req.body.blockedDates;
			}
			if(req.body.addedDates){
				doc.mentor[0].addedDates = req.body.addedDates;
			}
          	doc.save(function(err){
          		if(err){return res.sendStatus(400);}
				res.send({blocked : doc.mentor[0].blockedDates,
							added : doc.mentor[0].addedDates});
          	});

		});
	});
	router.post('/mentor/updateReminder', function(req,res){
		console.log(req.body);
		if(!req.user || req.user.status != 'mentor'){
			return res.sendStatus(401);
		}
		userProfile.findOne({'email': req.user.email}, function(err, doc){
			if(err || !doc){
				return res.sendStatus(400);
			}

			doc.mentor[0].availabilityReminder = req.body.frequence;
          	doc.save(function(err){
          		if(err){return res.sendStatus(400);}
				res.send(true);
          	});

		});
	});
	router.get('/mentor/getAvailability', function(req,res){
		if(!req.user || req.user.status != 'mentee'){
			return res.sendStatus(401);
		}
		console.log(req.user.mentor[0]);
		userProfile.findOne({"email": req.user.mentee[0].mentor}, function(err,doc){
			console.log("ERROR: "+err);
			console.log("Dcouments: "+doc);
			if(err || !doc){
				return res.sendStatus(400);
			}
			var mentorInfo = {
				availability: doc.mentor[0].availability,
				blockedDates : doc.mentor[0].blockedDates,
				addedDates: doc.mentor[0].addedDates
			};
			return res.send(mentorInfo);
		});
	});
//Modules routes//////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 	Routes for tracking / requesting / distributing training modules. 		//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	//This routes send the user the requested module from the Database. User send the querry name.
	//Information about the status, completion of the modules are stored on userProfile.
	//May want to double check what type of user is requesting.
	router.post('/modules/request', function(req,res){
		console.log(req.body);
		if(!req.user){ return res.sendStatus(401);}
		moduleModel.findOne({'name': req.body.module}, function(err, doc){
			if(err){
				return res.sendStatus(400);
			}
			if(!doc){
				console.log("The requested module does not exist");
				return res.send("The requested module does not exist");
			}
			return res.send(doc);
		});
	});
	//Updated the userProfile of a user to saves progress made on their modules.
	router.post('/modules/saveProgress', function(req,res){//body.module -> contains the module to overrite
		if(!req.user){ return res.sendStatus(401);}
		console.log(req.body);
		var newCompleted = false;
		userProfile.findOne({'email' : req.user.email }, function(err, doc){
			var index = doc.modules.map(function(e){return e.name;}).indexOf(req.body.name);
			//if the module is completed:
			if(!doc.modules[index].completed && req.body.completed === true)
			{
				newCompleted = true;
				//Mark the next module as enabled.
				if(doc.modules[index] < doc.modules.length-1)
				{
					doc.modules[index+1].enabled = true;
				}
			}
			doc.modules[index] = req.body;
			doc.markModified('modules');
			doc.save(function(err){
				if(err){
					return res.sendStatus(400);
				}
				if(newCompleted)
				{
					UpdateModuleTimelineEvent(req.user, req.body.name, 'completed', function(success){
					console.log("Updated module Timeline event status : " + success);
					return res.send(success);
					});
				}
				else
				{
					return res.send(true);
				}


			});
		});
	});