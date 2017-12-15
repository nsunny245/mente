var mongoose = require('mongoose');

var calendarTemp = mongoose.Schema({
	uniqueID: String,//for mentee it is set to their email's.
	events: [
	{
		id: String,     
		title: String,             
		allDay: Boolean,           
		start: Date,               
		end: Date,                 
		url: String,               
		className: [String],       
		editable: Boolean,         
		startEditable: Boolean,    
		durationEditable: Boolean, 
		rendering: String,         
		overlap: Boolean,          
		constraint: Object,        
		source: Object,
		color: String,   
		backgroundColor: String,
		borderColor: String,
		textColor: String,
		//extra fields
 		description: String,//Event description
 		stage: String,//Stage of the timeline.
 		info: String,//extra info for description or else.
 		menteeNotes: String,//Personal notes.
 		isMenteeOnly: Boolean,//if this event can only be seen by a mentee.
 		mentorNotes: String,//personal notes
 		extra: String
	}
	]
});

calendarTemp.methods.GetMentee = function(){
 	var cal = this;
 	var editedCal = [];
 	for(var i = 0; i < cal.events.length; i++)
 	{
 		var event = cal.events[i];
 		delete event.mentorNotes;
 		editedCal.push(event);
 	}
 
 	return editedCal;
 }
 
 calendarTemp.methods.GetMentor = function(){
 	var cal = this;
 	var editedCal = [];
 	for(var i = 0; i < cal.events.length; i++)
 	{
 		if(isMenteeOnly)
 		{
 			continue;
 		}
 		var event = cal.events[i];
 		delete event.menteeNotes;
 		editedCal.push(event);
 	}
 
 	return editedCal;
 }


module.exports = mongoose.model('calendarTemp', calendarTemp);