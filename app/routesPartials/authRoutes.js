//Authentication routes///////////////////////////////////////////////////////////
//																				//
//																				//
//	 Used for login using local/facebook/google and other services				//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	//Called when requesting a password reset.
	//Creates a resetPasswordToken on the DB and sends the link to the registered email.
	router.post('/passwordRetrieval', function(req,res){
		userProfile.findOne({'email': req.body.email}, function(err, recovered){
			if(err)
			{
				return err;
			}
			if(!recovered)
			{
				return res.send({message:'This email is not registered with the CommunAbility site.'});
			}

			var token = stringToASCII(req.body.email) + GenString(50);
			var link="http://"+req.get('host')+"/password/reset?id="+token;
			var locals = {
				//username: req.user.name || "User",
				recoverLink: link
			}
			recoverPassTemplate.render(locals, function(err, results) {
				if (err) {
					return console.error(err);
				}
				var mailOptions = {
				from: 'noreply@psdnet.com', // sender address
				to: recovered.email, // list of receivers
				subject: 'Password reset', // Subject line
				text: results.text, // plaintext body
				html: results.html
				};

				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						return res.send({message:'Error : ' + error});
					}
					recovered.resetPasswordToken = token;
					recovered.resetPasswordExpires = Date.now() + 3600000;
					recovered.save(function(err){
						if(err){
							console.log(err);
						}
						return res.send({message: "A recovery email has been sent to "+ req.body.email +"!"});
					});
				});
			});
		});
	});
	//When a user clicks on their password recovery link this route sends them to a basic page asking to reset their password.
	router.get('/password/reset', function(req,res){
		host=req.get('host');
		if((req.protocol+"://"+req.get('host'))==("http://"+host))
		{
			console.log("Domain is matched. Information is from Authentic email");
			console.log(req.query.id);
			userProfile.findOne({'resetPasswordToken': req.query.id, 'resetPasswordExpires': { $gt: Date.now() }}, function(err, temp){
				if(err)
				{
					return err;
				}
				if(!temp)
				{
					res.send("invalid Link or Token expired.");
					return;
				}

				//need to validate user account here. Removal will be automated after 24h.
				userProfile.findOne({'email': temp.email}, function(err, doc){
					if(err)
					{
						return err;
					}
					//Hard Coded Html inside email.
					res.send("<h1>Please enter a new password</h1><br>" +
					'<form action="/password/reset?id='+req.query.id+'" method="post">'+
					'<input type="password" class="form-control" name="password" ng-model="password" placeholder="Password" required><br>Confirm' +
					'<br><input type="password" class="form-control" name="passwordConfirm" ng-model="passwordConfirm" placeholder="confirm" required>'+
					'<input type="text" style="display:none;" class="form-control" name="id" ng-model="id" value="'+req.query.id+'">'+
					'<br><button type="submit">Reset</button></form>');
				});
			});
		}
		else
		{
			res.send("<h1>Request is from unknown source");
		}
	});
	//After submitting their new password the information is sent here and saved to the DB.
	router.post('/password/reset', function(req,res){
		console.log("Posting");
		console.log(req.query.id);
		userProfile.findOne({'resetPasswordToken' : req.query.id, 'resetPasswordExpires': {$gt : Date.now()}}, function(err,profile){

			if(!profile){
				return res.sendStatus(400);
			}
			profile.password = req.body.password;
			profile.resetPasswordToken = undefined;
			profile.resetPasswordExpires = undefined;
			profile.save(function(err){
				req.logIn(profile, function(err){
					res.redirect('/#/profile');
				});
			});
		});
	});
	//Baisc login using passport local-login.
	router.post('/login',
		passport.authenticate('local-login'),
		function(req, res, next) {
		    // If this function gets called, authentication was successful.
		    // `req.user` contains the authenticated user.
		    //res.send(req.user);
		    console.log(req.user);
		    res.send(req.user);
	});
	//On refresh resends the user information.
	router.post('/auth/refresh', isLoggedIn, function(req, res){
		if (!req.user) {
			return res.sendStatus(401);
		}
		console.log(req.user);
		res.send(req.user);
	});

	//Fetches the information of your assigned mentee/mentor to display on profile page.
	router.get('/retrieveProfileInfo', function(req, res){
		if (!req.user){
			return res.sendStatus(401);
		}
		if (req.user.status === "mentee"){
			userProfile.findOne({'email': req.user.mentee[0].mentor}, function(err, user){
				if (err) {
					return res.send(err);
				}
				if (!user) {
					return res.sendStatus(400);
				}
				var mentorInfo = {};
				mentorInfo.picture = user.picture;
				mentorInfo.name = user.mentor[0].firstName + " " +  user.mentor[0].lastName;
				mentorInfo.study = user.mentor[0].study;
				mentorInfo.currentField = user.mentor[0].currentField;
				mentorInfo.numberOfYearsInField = user.mentor[0].numberOfYearsInField;
				mentorInfo.highestEducation = user.mentor[0].highestEducation;
				mentorInfo.share = user.mentor[0].share;
				
				return res.send(mentorInfo);
			});
		} else if (req.user.status === "mentor" || req.user.status === "mentorFull") {
			var pass = 0;
			var menteeInfo = [];
			for (var i = 0; i < req.user.mentor[0].mentees.length; i++) {

				userProfile.findOne({ 'email': req.user.mentor[0].mentees[i]}, function (err, user) {
					if (err) {
						return res.send(err);
					}
					if (!user) {
						return res.sendStatus(400);
					}
					var menteeOne = {};
					menteeOne.picture = user.picture;
					menteeOne.name = user.mentee[0].firstName + " " + user.mentee[0].lastName;
					menteeOne.study = user.mentee[0].study;
					menteeOne.currentField = user.mentee[0].currentField;
					menteeOne.numberOfYearsInField = user.mentee[0].numberOfYearsInField;
					menteeOne.highestEducation = user.mentee[0].highestEducation;
					menteeOne.share = user.mentee[0].share;

					menteeInfo[i] = menteeOne;
					if (++pass === req.user.mentor[0].mentees.length){
						console.log(menteeInfo);
						return res.send(menteeInfo);
					}
				})
			}
		}
	});
	//same as above, but fetches instead all *past* assignees
	router.get('/retrievePastProfileInfo', function(req, res){
		if (!req.user) {
			return res.sendStatus(401);
		}
		if (req.user.status === "mentee") {
			var pass = 0;
			var mentorInfo = [];
			for (var i = 0; i < req.user.mentee[0].pastMentors.length; i++) {

				userProfile.findOne({ 'email': req.user.mentee[0].pastMentors[i]}, function (err, user) {
					if (err) {
						return res.send(err);
					}
					if (!user) {
						return res.sendStatus(400);
					}
					var mentorOne = {};
					mentorOne.picture = user.picture;
					mentorOne.name = user.mentor[0].firstName + " " +  user.mentor[0].lastName;
					mentorOne.study = user.mentor[0].study;
					mentorOne.currentField = user.mentor[0].currentField;
					mentorOne.numberOfYearsInField = user.mentor[0].numberOfYearsInField;
					mentorOne.highestEducation = user.mentor[0].highestEducation;
					mentorOne.share = user.mentor[0].share;

					mentorInfo[i] = mentorOne;
					if (++pass === req.user.mentee[0].pastMentors.length){
						console.log(mentorInfo);
						return res.send(mentorInfo);
					}
				});
			}
		} else if (req.user.status === "mentor" || req.user.status === "mentorFull") {
			var pass = 0;
			var menteeInfo = [];
			for (var i = 0; i < req.user.mentor[0].pastMentees.length; i++) {

				userProfile.findOne({ 'email': req.user.mentor[0].pastMentees[i]}, function (err, user) {
					if (err) {
						return res.send(err);
					}
					if (!user) {
						return res.sendStatus(400);
					}
					var menteeOne = {};
					menteeOne.picture = user.picture;
					menteeOne.name = user.mentee[0].firstName + " " + user.mentee[0].lastName;
					menteeOne.study = user.mentee[0].study;
					menteeOne.currentField = user.mentee[0].currentField;
					menteeOne.numberOfYearsInField = user.mentee[0].numberOfYearsInField;
					menteeOne.highestEducation = user.mentee[0].highestEducation;
					menteeOne.share = user.mentee[0].share;

					menteeInfo[i] = menteeOne;
					if (++pass === req.user.mentor[0].pastMentees.length){
						console.log(menteeInfo);
						return res.send(menteeInfo);
					}
				})
			}
		}
	});
	//Close session.
	router.get('/logout', function(req, res){
		req.session.destroy(function(err){
			return res.redirect('/');
		});
	});