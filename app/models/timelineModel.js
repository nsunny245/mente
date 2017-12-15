var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timelineEvent =  new Schema({
	_id: Number,//when saved the id will represent the order.

    bookByWeekBase : Number,
    bookByWeek : Number,
    phase : String,

    title : [String],
    content : [String],

    duration : Number,    
    activity : [{}],

    calendarEnabled : Boolean,
    end : Date,
    start : Date,
    allDay : Boolean,

    marker : String,
    markerText : String,
    markerType : String,
    className : [String],

    chronology : String,//current Chronology of the event: upcoming, inprogress, pastDue, completed.
    status : Number,//event status or array position for content/title.   
 
    iCal: String// Ical linked to this event if applicable.
},{ _id : false });

var timelineModel = new Schema({
	_id: String,//made by the user's email + random genstring 50.
	timelineType: String,//mentee,mentor,others
	events:[timelineEvent],//events should be added/remove completely when updating them.
	startDate: Date,
	offsetInDays: Number
},{_id: false});


module.exports = mongoose.model('timelineModel', timelineModel);

/*Activity:
{
    enabled: String,//if this icon is enabled
	type: String,//what type of event this is. Also affects the icon
    text: string,//front facing text if needed
    altText: String,//Behind the scene text for screen reader.
	link: String//The link using ui router: state.go("link");
	
}
*/

//standard application training mentor curriculum step1