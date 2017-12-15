var mongoose = require('mongoose');

var timestampModel = mongoose.Schema({
	
	email: String,//account associate with the stamp.
	date: Date,//startime
	duration: Number,//stamp duration. Stored on the model for security
	
});


timestampModel.methods.Validate = function Validate () {
	console.log(date.getTime() + duration);
	console.log( d);
	var d = new Date();
  return (date + duration) > d.getTime();
};

module.exports = mongoose.model('timestampModel', timestampModel);