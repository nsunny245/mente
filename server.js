var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var configParams = require('./config/config.js');//Default application values/settings.

//------------------DataBase----------------------------------------------//
var configDB = require('./config/database.js');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);



require('./config/passport')(passport);


app.use(express.static(__dirname + '/app/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());
                                  
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(session({secret: GenSecret(50), 
						store: new MongoStore({
												url:configDB.url
												}),
						saveUninitialized: false,
						resave: false,
						rolling: false,
						cookie: {maxAge: configParams.session.maxAge}}));

//This function checks all http requests and refreshes the expiry of the session timer.
//if does not refresh when checking for new messages ->'/chat/checkForNewMessages'.
//This function runs every 1 secs automaticly.
app.use(function(req, res, next) {
	if(res.req.url === '/chat/checkForNewMessages'){//Hard coded bad bit of code!
		return next();
	}
	req.session._garbage = Date();
	req.session.touch();
	next();
});

//-------------------Socket IO---------------------------------------------//

var server = require("http").createServer(app);
//var io = require("socket.io").listen(server);



//-------------------Passport and authentication------------------------------//


app.use(passport.initialize());
app.use(passport.session());



require('./app/routes.js')(app, passport);



server.listen(port, function (){
	console.log("Server running on port:" + port);
});


function GenSecret(StringLength){
	    var generatedString = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < StringLength; i++ ){
	        generatedString += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

	    return generatedString;
	};