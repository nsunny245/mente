var mongoose = require('mongoose');

var cm_Messages = mongoose.Schema({
	{
		main: {
			title: String, 
			content: String
		},
		altMain: {
			title: String, 
			content: String
		},



		daily: String[],
		announcements: String[],

		info: String[],
		learning: String[],

		contact: {
			name: String, 
			title: String, 
			email: String, 
			phone: String, 
			office: String, 
			alt: String
		},

		log: String
	}
});

module.exports = mongoose.model('cm_Messages', cm_Messages);