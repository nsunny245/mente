var fs = require('fs');

var DEFAULT_TIMELINE_PATH = __dirname + '/data/defaultTimeline.json';
var eventTemplate = {
	id: null,
	calendarEnabled: null,
	title: null,
	altTitle: null,
	finalTitle: null,
	allDay: null,
	start: null,
	end: null,
	className: [],
	status: null,
	eventStatus: null, //initial, following, final
	marker: null,
	markerType: null,
	phase: null,
	duration: null,
	content: null,
	followingContent: null,
	finalContent: null,
	activity: [],
	settings: {},
	ical: null
};

var exports = module.exports = {};

exports.genTimeline = function (type, callback) {

	var timeline = [];
	var currentTime = Date.now();

	var firstSunday = new Date();
	firstSunday.setHours(0);
	firstSunday.setMinutes(0);
	firstSunday.setSeconds(0);
	firstSunday.setMilliseconds(0);
	if (firstSunday.getDay() === 0) {
		console.log("Already Sunday");
	}
	else {
		var daysOff = 7 - firstSunday.getDay();
		firstSunday = addDays(firstSunday, daysOff);
	}
	// if(type === 99){
	// 	firstSunday.setDate(firstSunday.getDate()-21);
	// }
	if (type == "mentee") {
		DEFAULT_TIMELINE_PATH = __dirname + '/data/menteeTimeline.json';
	} else if (type == "mentor") {
		DEFAULT_TIMELINE_PATH = __dirname + '/data/mentorTimeline.json';
	} else {
		console.log("you did not specify a timeline type, reverting to default");
	}
	console.log(firstSunday);
	console.log("TIMELINE GENERATING");
	readJSONFile(DEFAULT_TIMELINE_PATH, function (err, loadedJSON) {
		if (err) {
			throw err;
		}

		for (i = 0; i < loadedJSON.events.length; i++) {

			var newEvent = loadedJSON.events[i];
			newEvent.createdOn = currentTime;
			newEvent.id = i;
			console.log(newEvent.bookByWeekBase);
			/*if(newEvent.bookByWeekBase != null)
			{
				var bookByWeek = new Date(firstSunday);
				bookByWeek.setDate(firstSunday.getDate() + ( newEvent.bookByWeekBase * 7) );
				newEvent.bookByWeek = bookByWeek;
				console.log(newEvent.bookByWeek);
			}*/

			//set the date here base on program start date.

			timeline.push(newEvent);
		}
		console.log(timeline);
		console.log("timeline generated");
		return callback(timeline);
	});
}
//returns an empty/nulled template.
exports.getTemplate = eventTemplate;

function readJSONFile(filepath, callback) {
	fs.readFile(filepath, function (err, data) {
		if (err) {
			callback(err);
			return;
		}
		try {
			callback(null, JSON.parse(data));
		}
		catch (exception) {
			callback(exception);
		}
	});
}

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}


exports.genBothTimeline = function (callback) {
	var timeline = [];
	var currentTime = Date.now();

	var firstSunday = new Date();
	firstSunday.setHours(0);
	firstSunday.setMinutes(0);
	firstSunday.setSeconds(0);
	firstSunday.setMilliseconds(0);
	if (firstSunday.getDay() === 0) {
		console.log("Already Sunday");
	}
	else {
		var daysOff = 7 - firstSunday.getDay();
		firstSunday = addDays(firstSunday, daysOff);
	}
	console.log("TIMELINE FOR BOTH GENERATING");
	readJSONFile(__dirname + '/data/menteeTimeline.json', function (err, loadedJSON) {
		if (err) {
			throw err;
		}

		for (i = 0; i < loadedJSON.events.length; i++) {

			var newEvent = loadedJSON.events[i];
			newEvent.createdOn = currentTime;
			console.log(newEvent.bookByWeekBase);
			newEvent._id = i;
			if (newEvent.bookByWeekBase != null) {
				var bookByWeek = new Date(firstSunday);
				bookByWeek.setDate(firstSunday.getDate() + (newEvent.bookByWeekBase * 7));
				newEvent.bookByWeek = bookByWeek;
				console.log(newEvent.bookByWeek);
			}

			//set the date here base on program start date.

			timeline.push(newEvent);
		}
		var timeline2 = [];

		readJSONFile(__dirname + '/data/mentorTimeline.json', function (err, loadedJSON) {
			if (err) {
				throw err;
			}

			for (i = 0; i < loadedJSON.events.length; i++) {
				var newEvent = loadedJSON.events[i];
				newEvent.createdOn = currentTime;
				console.log(newEvent.bookByWeekBase);
				newEvent.id = i;
				if (newEvent.bookByWeekBase != null) {
					var bookByWeek = new Date(firstSunday);
					bookByWeek.setDate(firstSunday.getDate() + (newEvent.bookByWeekBase * 7));
					newEvent.bookByWeek = bookByWeek;
					console.log(newEvent.bookByWeek);
				}

				//set the date here base on program start date.

				timeline2.push(newEvent);
			}
			return callback(timeline, timeline2);


		});


	});
	//past training, confirmed school email
	exports.genFirstStageMenteeTimeline = function (callback) {
		var timeline = [];
		var currentTime = Date.now();

		var firstSunday = new Date();
		firstSunday.setHours(0);
		firstSunday.setMinutes(0);
		firstSunday.setSeconds(0);
		firstSunday.setMilliseconds(0);
		if (firstSunday.getDay() === 0) {
			console.log("Already Sunday");
		}
		else {
			var daysOff = 7 - firstSunday.getDay();
			firstSunday = addDays(firstSunday, daysOff);
		}
		console.log("TIMELINE FOR BOTH GENERATING");
		readJSONFile(__dirname + '/data/menteeTimeline.json', function (err, loadedJSON) {
			if (err) {
				throw err;
			}

			for (i = 0; i < loadedJSON.events.length; i++) {

				var newEvent = loadedJSON.events[i];
				newEvent.createdOn = currentTime;
				console.log(newEvent.bookByWeekBase);
				if (newEvent.bookByWeekBase != null) {
					var bookByWeek = new Date(firstSunday);
					bookByWeek.setDate(firstSunday.getDate() + (newEvent.bookByWeekBase * 7));
					newEvent.bookByWeek = bookByWeek;
					console.log(newEvent.bookByWeek);
				}
				//set the date here base on program start date.
				timeline.push(newEvent);
				//timeline.
			}

			return callback(timeline);
		});
	}
}

