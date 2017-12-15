var mongoose = require('mongoose');



var content = mongoose.Schema({
	pages: {

		home: {},
		login: {},
		//About
		pillars: {},
		about: {},
		contact: {},
		//Community
		community: {},
		forum: {},
		//Dashboard
		profile: {},
		//education
		education: {},
		news: {},
		podcasts: {},
		webinars: {},
		//featured
		featured: {},
		//mentorship
		chat: {},
		evaluation: {},
		mentor: {},
		mentorship: {},
		signup: {},
		timeline: {},
		training: {}

	}
});



module.exports = mongoose.model('content', content);
