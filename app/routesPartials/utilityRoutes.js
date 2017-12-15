//Utility routes//////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 							System/Miscellaneous							//
//																				//
//////////////////////////////////////////////////////////////////////////////////
router.post('/system/removeExpiredTokens', function (req, res) {
	ClearExpiredTokens(function (count) {
		res.send({ "removed": count });
	});
});
router.post('/system/removeUnverifiedExpiredUsers', function (req, res) {
	ClearUnverifiedExpiredAccounts(function (count) {
		res.send({ "removed": count });
	});
});

router.post('/set/removeProfile', function (req, res) {removeProfile(req, res)});

//REMOVE THIS ROUTE BEFORE DEPLOYS!! TODO
router.get('/set/removeProfiles', function (req, res) {
	// if (!req.user || req.user.status !== "admin"){
	// 	return res.sendStatus(401);
	// }
	userProfile.find({}, function (err, docs) {
		for (var i = 0; i < docs.length; i++) {
			docs[i].remove();
			if (i == docs.length - 1) { res.send("deleted all profiles"); };
		}

	});
});
//TODO TEMP ROUTE!!!! MUST REMOVE
router.get('/set/removeForums', function (req, res) {
	// if (!req.user || req.user.status !== "admin"){
	// 	return res.sendStatus(401);
	// }
	forumPost.find({}, function (err, docs) {
		for (var i = 0; i < docs.length; i++) {
			docs[i].remove();
			if (i == docs.length - 1) { res.send("deleted all forum posts"); };
		}

	});
});

router.get('/set/initialMentee', function (req, res) {
	// userProfile.findOne({ 'email': 'mentee@mail.com' }, function (err, doc) {
	// 	if (err) {
	// 		console.log("Can't find user profile");
	// 		return res.send(404);
	// 	}
	// 	doc.remove();
	// 	res.send("deleted" + req.user.email);
	// })
	var setCount = 0;
	utilFuncs(setCount);
	timeline.genFirstStageMenteeTimeline = function (menteetimeline) {
		var menteeObject = {
			_id: 0,
			//mentor: ,
			declarationsMade: true,
			trainingCompleted: true,
			why: "why not",
			currentField: 'Science',

			share: 'Hi im Dan and I would like someone to help me out with school issues.',

			gender: ['Male'],
			study: 'Science',
			biggestChallenge: 'Bullying',
			isCurrentlyInMentorship: false,
			currentlyInMentorshipDetails: null,
			isCommit: true,
			preferences: ['high', 'low', 'none'],
			disabilities: ['mental', 'learning'],
			age: 19,
			lastName: 'Drako',
			middleName: "D",
			firstName: 'Daniel',
			schoolEmailVerified: true,
			schoolEmail: 'mentee@georgebrown.ca',
			schoolName: "George Brown",
			//admin section below.
			timeline: menteetimeline
		};

		var newMentee = new userProfile();
		newMentee.email = 'mentee@mail.com';
		newMentee.password = 'password';
		newMentee.since = Date.now();
		newMentee.username = 'menteeUser';
		newMentee.status = 'menteeInTraining';
		newMentee.votes = [];
		newMentee.documents = ["handbook", "curriculum", "learn", "keystosuccess"];
		// newMentee.activities = [{ _id: 0, date: Date.now(), type: 'achievement', title: 'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false }];
		// newMentee.modules = [{
		// 	name: 'intro',
		// 	completedSteps: 0,
		// 	currentSlide: 0
		// }];
		newMentee.picture = '';
		newMentee.mentee.push(menteeObject);
		newMentee.save(function (err) {
			if (err) {
				throw err;
			}
			else {
				setCount++;
				console.log("mentee created");
			}
		});
	}
})



//Main test route to setup DB with fake users.
router.get('/set/alltest', function (req, res) {
	var setCount = 0;

	var newAdmin = new userProfile();
	newAdmin.email = 'admin@mail.com';
	newAdmin.password = 'password';
	newAdmin.since = Date.now();
	newAdmin.username = 'admin';
	newAdmin.status = 'admin';
	newAdmin.votes = [];
	newAdmin.picture = '';
	newAdmin.save(function (err) {
		if (err) {
			throw err;
		}
		else {
			setCount++;
			console.log("Admin created");
			res.send("admin created");
		}
	});

	/*
	timeline.genBothTimeline(function(menteetimeline, mentortimeline){
		if(menteetimeline && mentortimeline){
			console.log("made timelines for both");
		};

		var availObj = [[],[],[],[],[],[],[]];
			for(var i = 0 ; i < 7; i++){
				for(var j = 0 ; j < 3; j++){
					availObj[i].push({'available': false, 'start': null});
				}
			}
		var mentorObject = {
			_id : 0,
			workEmail: 'workmail@mail.com',
			preferredEmail: 'personal',
			phone: '450-552-5252',
			firstName: 'Leon',
			middleName: 'Ard',
			lastName: 'Quint',

			gender:  ['Male'],
			age: 23,
			isGraduate: true,
			highestEducation: 'college',
			study: 'Natural Sciences',
			currentField: 'Biology',
			numberOfYearsInField: '3',

			why: 'I like to help',
			isCurrentlyInMentorship: false,
			currentlyInMentorshipDetails: null,
			gain: 'Personal growth',
			gainMentee: 'A successful education.',
			isCommit: true,
			share: 'Hi my name is Leon and I like to play bowling',
			disabilities: ['mental', 'learning'],
			bestSuited: ['high', 'low', 'none'],
			//admin section below.
			numberOfMentees: 1,
			mentees: ['mentee@mail.com'],
			timeline: mentortimeline,
			availability: availObj,
			availabilityReminder: "monthly",
			addedDates: [{	start: new Date(1473095523000),
							end: new Date(1473099123000)},
						 {start: new Date(1473181923000), end: new Date(1473201923000)}],
			blockedDates: [{start: new Date(1473395523000), end: new Date(1473419123000)},
						 {start: new Date(1473481923000), end: new Date(1474201923000)}],
			isPoliceChecked: true,
			policeCheck: '',
			shareProfileOptIn: true
		};

		var menteeObject = {
			_id : 0,
				schoolEmail: 'mentee@georgebrown.ca',
				firstName: 'Daniel',
				middleName: "D",
				lastName: 'Drako',
				age: 19,
				gender:  ['Male'],
				study: 'Science',
				biggestChallenge: 'Bullying',
				isCurrentlyInMentorship: false,
				currentlyInMentorshipDetails: null,
				isCommit: true,
				share: 'Hi im Dan and I would like someone to help me out with school issues.',
				currentField: 'Science',
				preferences:  ['high', 'low', 'none'],
				disabilities: ['mental', 'learning'],
			//admin section below.
			isSchoolChecked: true,
			timeline: menteetimeline,
			mentor: "mentor@mail.com"
		};

		var newAdmin = new userProfile();
					newAdmin.email = 'admin@mail.com';
					newAdmin.password = 'password';
					newAdmin.since = Date.now();
					newAdmin.username = 'admin';
					newAdmin.status = 'admin';
					newAdmin.votes = [];
					newAdmin.picture = '';
					newAdmin.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("Admin created");
							}
					});
		var newMentee = new userProfile();
					newMentee.email = 'mentee@mail.com';
					newMentee.password = 'password';
					newMentee.since = Date.now();
					newMentee.username = 'menteeUser';
					newMentee.status = 'mentee';
					newMentee.votes = [];
					newMentee.documents = ["handbook", "curriculum", "learn", "keystosuccess"];
					newMentee.activities = [{_id: 0, date: Date.now(), type: 'achievement', title:'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false}];
					newMentee.modules = [{
						name: 'intro',
						completedSteps : 0,
						currentSlide: 0
					}];
					newMentee.picture = '';
					newMentee.mentee.push(menteeObject);
					newMentee.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("mentee created");
							}
					});
		var newMentor = new userProfile();
					newMentor.email = 'mentor@mail.com';
					newMentor.password = 'password';
					newMentor.since = Date.now();
					newMentor.username = 'mentorUser';
					newMentor.status = 'mentor';
					newMentor.votes = [];
					newMentor.documents = ["handbook", "curriculum", "learn", "keystosuccess"];
					newMentor.picture = '';
					newMentor.activities = [{_id: 0, date: Date.now(), type: 'achievement', title:'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false}];
					newMentor.mentor.push(mentorObject);
					newMentor.modules = [{
						name: 'mentor intro',
						completedSteps : 0,
						currentSlide: 0
					},{
						name: 'intro',
						completedSteps : 0,
						currentSlide: 0
					}];
					newMentor.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("mentor created");
							}
					});

		var newVerified = new userProfile();
		newVerified.email = 'verified@mail.com';
		newVerified.password = 'password';
		newVerified.since = Date.now();
		newVerified.username = 'verifiedUser';
		newVerified.status = 'verified';
		newVerified.votes = [];
		newVerified.documents = [];
		newVerified.picture = '';
		//newUnfinshedMentee.mentee.push(unfinshedObject);
		newVerified.save(function(err){
				if(err)	{
					throw err;
				}
				else{
					setCount++;
					console.log("a verified user created");
				}
		});
	})

	chatContainer.findOne({'chatID':stringToASCII('mentee@mail.com' + 'mentor@mail.com')},function(err, doc){
		if(err){

			console.log('chatContainer count error: ' + err);
		}
		if(doc){
			setCount++;
			console.log('Error creating chats. Previously created chat exists: ' + doc);
			return;
		}


		var newChatCTN = new chatContainer();
		newChatCTN.chatID = stringToASCII('mentee@mail.com' + 'mentor@mail.com');
		newChatCTN.mentee = 'mentee@mail.com';
		newChatCTN.mentor = 'mentor@mail.com';


		var generalChat = {
			name: "General",
			show: true,
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
			name: "Get to know each other",
			show: true,
			phase: 1,
			order: 1,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 30,
			description: 'Phase one involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the know each other chat!",
				status: "unread",
				flag: "system",
				'id': 0,
				date: Date.now()
			}]
		};

		var chat3 = {
			name: "Study tricks",
			show: false,
			phase: 2,
			order: 2,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 45,
			description: 'Phase two involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the Study tricks chat!",
				status: "unread",
				flag: "system",
				'id': 0,
				date: Date.now()
			}]
		};

		var chat4 = {
			name: "Exam Preparation",
			show: false,
			phase: 2,
			order: 3,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 60,
			description: 'Phase three involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the Exam Preparation chat!",
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

		newChatCTN.save(function(err){
			if(err)	{
				throw err;
			}
			else{
				setCount++;
				console.log('chat create correctly!');
			}
		});
	});

	

	/*
	timeline.genBothTimeline(function(menteetimeline, mentortimeline){
		if(menteetimeline && mentortimeline){
			console.log("made timelines for both");
		};

		var availObj = [[],[],[],[],[],[],[]];
			for(var i = 0 ; i < 7; i++){
				for(var j = 0 ; j < 3; j++){
					availObj[i].push({'available': false, 'start': null});
				}
			}
		var mentorObject = {
			_id : 0,
			workEmail: 'workmail@mail.com',
			preferredEmail: 'personal',
			phone: '450-552-5252',
			firstName: 'Leon',
			middleName: 'Ard',
			lastName: 'Quint',

			gender:  ['Male'],
			age: 23,
			isGraduate: true,
			highestEducation: 'college',
			study: 'Natural Sciences',
			currentField: 'Biology',
			numberOfYearsInField: '3',

			why: 'I like to help',
			isCurrentlyInMentorship: false,
			currentlyInMentorshipDetails: null,
			gain: 'Personal growth',
			gainMentee: 'A successful education.',
			isCommit: true,
			share: 'Hi my name is Leon and I like to play bowling',
			disabilities: ['mental', 'learning'],
			bestSuited: ['high', 'low', 'none'],
			//admin section below.
			numberOfMentees: 1,
			mentees: ['mentee@mail.com'],
			timeline: mentortimeline,
			availability: availObj,
			availabilityReminder: "monthly",
			addedDates: [{	start: new Date(1473095523000),
							end: new Date(1473099123000)},
						 {start: new Date(1473181923000), end: new Date(1473201923000)}],
			blockedDates: [{start: new Date(1473395523000), end: new Date(1473419123000)},
						 {start: new Date(1473481923000), end: new Date(1474201923000)}],
			isPoliceChecked: true,
			policeCheck: '',
			shareProfileOptIn: true
		};

		var menteeObject = {
			_id : 0,
				schoolEmail: 'mentee@georgebrown.ca',
				firstName: 'Daniel',
				middleName: "D",
				lastName: 'Drako',
				age: 19,
				gender:  ['Male'],
				study: 'Science',
				biggestChallenge: 'Bullying',
				isCurrentlyInMentorship: false,
				currentlyInMentorshipDetails: null,
				isCommit: true,
				share: 'Hi im Dan and I would like someone to help me out with school issues.',
				currentField: 'Science',
				preferences:  ['high', 'low', 'none'],
				disabilities: ['mental', 'learning'],
			//admin section below.
			isSchoolChecked: true,
			timeline: menteetimeline,
			mentor: "mentor@mail.com"
		};

		var newAdmin = new userProfile();
					newAdmin.email = 'admin@mail.com';
					newAdmin.password = 'password';
					newAdmin.since = Date.now();
					newAdmin.username = 'admin';
					newAdmin.status = 'admin';
					newAdmin.votes = [];
					newAdmin.picture = '';
					newAdmin.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("Admin created");
							}
					});
		var newMentee = new userProfile();
					newMentee.email = 'mentee@mail.com';
					newMentee.password = 'password';
					newMentee.since = Date.now();
					newMentee.username = 'menteeUser';
					newMentee.status = 'mentee';
					newMentee.votes = [];
					newMentee.documents = ["handbook", "curriculum", "learn", "keystosuccess"];
					newMentee.activities = [{_id: 0, date: Date.now(), type: 'achievement', title:'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false}];
					newMentee.modules = [{
						name: 'intro',
						completedSteps : 0,
						currentSlide: 0
					}];
					newMentee.picture = '';
					newMentee.mentee.push(menteeObject);
					newMentee.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("mentee created");
							}
					});
		var newMentor = new userProfile();
					newMentor.email = 'mentor@mail.com';
					newMentor.password = 'password';
					newMentor.since = Date.now();
					newMentor.username = 'mentorUser';
					newMentor.status = 'mentor';
					newMentor.votes = [];
					newMentor.documents = ["handbook", "curriculum", "learn", "keystosuccess"];
					newMentor.picture = '';
					newMentor.activities = [{_id: 0, date: Date.now(), type: 'achievement', title:'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false}];
					newMentor.mentor.push(mentorObject);
					newMentor.modules = [{
						name: 'mentor intro',
						completedSteps : 0,
						currentSlide: 0
					},{
						name: 'intro',
						completedSteps : 0,
						currentSlide: 0
					}];
					newMentor.save(function(err){
							if(err)	{
								throw err;
							}
							else{
								setCount++;
								console.log("mentor created");
							}
					});

		var newVerified = new userProfile();
		newVerified.email = 'verified@mail.com';
		newVerified.password = 'password';
		newVerified.since = Date.now();
		newVerified.username = 'verifiedUser';
		newVerified.status = 'verified';
		newVerified.votes = [];
		newVerified.documents = [];
		newVerified.picture = '';
		//newUnfinshedMentee.mentee.push(unfinshedObject);
		newVerified.save(function(err){
				if(err)	{
					throw err;
				}
				else{
					setCount++;
					console.log("a verified user created");
				}
		});
	})

	chatContainer.findOne({'chatID':stringToASCII('mentee@mail.com' + 'mentor@mail.com')},function(err, doc){
		if(err){

			console.log('chatContainer count error: ' + err);
		}
		if(doc){
			setCount++;
			console.log('Error creating chats. Previously created chat exists: ' + doc);
			return;
		}


		var newChatCTN = new chatContainer();
		newChatCTN.chatID = stringToASCII('mentee@mail.com' + 'mentor@mail.com');
		newChatCTN.mentee = 'mentee@mail.com';
		newChatCTN.mentor = 'mentor@mail.com';


		var generalChat = {
			name: "General",
			show: true,
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
			name: "Get to know each other",
			show: true,
			phase: 1,
			order: 1,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 30,
			description: 'Phase one involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the know each other chat!",
				status: "unread",
				flag: "system",
				'id': 0,
				date: Date.now()
			}]
		};

		var chat3 = {
			name: "Study tricks",
			show: false,
			phase: 2,
			order: 2,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 45,
			description: 'Phase two involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the Study tricks chat!",
				status: "unread",
				flag: "system",
				'id': 0,
				date: Date.now()
			}]
		};

		var chat4 = {
			name: "Exam Preparation",
			show: false,
			phase: 2,
			order: 3,
			menteeStatus: 'away',
			mentorStatus: 'away',
			duration: 60,
			description: 'Phase three involves working together to identify the mentee’s needs and set smart goals! Use the resource provided below (pdf). This activity should take approximately 30 minutes.',
			messages: [{
				sender: "admin",
				content: "Welcome to the Exam Preparation chat!",
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

		newChatCTN.save(function(err){
			if(err)	{
				throw err;
			}
			else{
				setCount++;
				console.log('chat create correctly!');
			}
		});
	});*/

});
//TODO REMOVE TEST
router.post('/test/autocomplete', function (req, res) {
	AutoCompleteAppointments();
});

///Do not remove.
//Let's us use router for our routes.
app.use('/', router);
StartDailyFunctions();
setInterval(function () {
	ClearExpiredTimeStamps(function (count) {
		//console.log("Cleared " + count + " time stamps.");
	});


}, 30000)} //again, ignore your linter!

//steve mcconnell please don't be mad
function utilFuncs(setCount) {
	calendarModel.count(function (err, count) {
		if (err) { throw err; }
		var calCMModel = new calendarModel();
		readJSONFile(__dirname + '/ContentManager/Resources/Calendar/master_calendar_2016.json', function (err, json_calendarEvent) {
			if (err) { throw err; }
			calCMModel.events = json_calendarEvent.events;
			calCMModel.uniqueID = json_calendarEvent.year;
			console.log(json_calendarEvent);
			if (count === 0) {
				calCMModel.save(function (err) {
					if (err) {
						throw err;
					} else {
						console.log("First upload of messages documents.");
						setCount++;

					}
				});
			} else if (count === 1) {
				calendarModel.find().remove(function (err) {
					if (err) {
						throw err;
					}
					calCMModel.save(function (err) {
						if (err) {
							throw err;
						} else {
							console.log("CALENDAR FILES OVERWRITTEN!");
							setCount++;
						}
					});
				});
			}
		});
	});

	// readJSONFolder(__dirname + '/ContentManager/Resources/Modules/', function (err, loadedJSONs) {
	// 	if (err) {
	// 		console.log(err);
	// 		return res.send(400);
	// 	}
	// 	var moduleProccessed = 0;
	// 	var moduleSaved = 0;
	// 	for (var i = 0; i < loadedJSONs.length; i++) {
	// 		saveModuleToDB(loadedJSONs[i], function (succes) {
	// 			if (succes) {
	// 				moduleSaved++;
	// 			}
	// 			moduleProccessed++;
	// 			if (moduleProccessed === loadedJSONs.length) {
	// 				console.log("Uploaded : " + moduleSaved + " of " + loadedJSONs.length + " modules from JSONs.");
	// 				setCount++;
	// 			}
	// 		});
	// 	}
	// });

	termsAndConditionsModel.count(function (err, count) {
		if (err) { throw err; }
		var tmModel = new termsAndConditionsModel();
		readJSONFile(__dirname + '/ContentManager/Resources/TermsAndConditions/TandC.json', function (err, json_tc) {
			console.log(json_tc);
			tmModel.tcObj = json_tc.tcObj;
			if (count === 0) {
				tmModel.save(function (err) {
					if (err) {
						throw err;
					} else {
						console.log("First upload of documents.");
					}
				});
			} else if (count === 1) {
				termsAndConditionsModel.find().remove(function (err) {
					if (err) {
						throw err;
					}
					tmModel.save(function (err) {
						if (err) {
							throw err;
						} else {
							console.log("FILES OVERWRITTEN!");
							setCount++;
						}
					});
				});
			}
		});
	});
}

