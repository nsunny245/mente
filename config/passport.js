var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


//var User = require('../app/models/user');
var userProfile = require('../app/models/userProfile');
//var tl_event = require('../app/models/Timeline/tl_event');
var configAuth = require('./auth');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		userProfile.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			console.log(req.body);
			process.nextTick(function(){
					
				userProfile.findOne({'email': req.body.email}, function(err, user){
					if(err)
					{
						return done(err);
					}

					if(user)
					{
						return done(null, false, 'This email is already registered');
					}
					else
					{
						
						var newUser = new userProfile();
						newUser.email = req.body.email;
						newUser.password = req.body.password;
						newUser.since = Date.now();
						newUser.username = req.body.displayName;
						newUser.status = 'unverified';
						newUser.isUsernameApproved = false;
						newUser.votes = [];
						newUser.documents = [];
						newUser.modules = [];
						newUser.picture = '';																									
						newUser.activities = [{_id: 0, date: Date.now(), type: 'achievement', title:'You joined', body: 'Welcome the CommunAbility', archived: false, viewed: false}];
						newUser.save(function(err){
								if(err)	{
									throw err;
								}
								else{
									
									return done(null, newUser);
								}
							})
						

					}
				})

			});
	}));
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){

			userProfile.findOne({'email': email}, function(err, user){
				if(err)
				{
					console.log("error");
					return done(err);
				}
				if(!user)
				{
					console.log("no user");
					return done( null, false, 'invalid e-mail address or password');
				}
				if(!user.validatePassword(password))
				{
					console.log("invalid password");
					return done(null, false, 'invalid e-mail address or password');
				}
				console.log(done + "----" + user );
				return done(null, user);
			})
		})
	}
	));
	passport.use('chat-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){

			userProfile.findOne({'email': email}, function(err, user){
				if(err)
				{
					console.log("error");
					return done(err);
				}
				if(!user)
				{
					console.log("no user");
					return done( null, false, 'invalid e-mail address or password');
				}
				if(!user.validatePassword(password))
				{
					console.log("invalid password");
					return done(null, false, 'invalid e-mail address or password');
				}
				console.log(done + "----" + user );
				return done(null, true);
			})
		})
	}
	));

	passport.use(new FacebookStrategy(
		{
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    profileFields: ['emails' , 'name']
	 	},
	  	function(accessToken, refreshToken, profile, done) 
	  	{
			process.nextTick(function()
			{
				User.findOne({'facebook.id' : profile.id}, function(err, user)
				{
					if(err)
					{
						return done(err);
					}
					if(user)
					{
						return done(null, user);
					}
					else
					{
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = accessToken;
						newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;


						newUser.save(function(err)
						{
							if(err)
							{
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			});
    }));
	

};

