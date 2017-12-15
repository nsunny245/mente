var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slide = new Schema({
	_id: Number,//also the page number from 0
	title: String,
	subtitles: [String],
	paragraphs: [String],
	subparagraphs:[String],
	tooltips:[String],
	links:[String],
	stories:[String],
	extra:[{}]

},{ _id : false });

var moduleModel = new Schema({
	
	name: String,		//unique name for the module
	steps: Number,		//How many steps the user needs to complete. More or less 1 per page but could be more.
						//Also used as a saving point reference.
	slides:[slide],
	type: String,		//The type of module. NOT USED ATM.
	providedBy: String,	//Who is the module provider/maker. NOT USED ATM.	
});

module.exports = mongoose.model('moduleModel', moduleModel);
