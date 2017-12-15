id: Number
calendarEnabled: boolean
title: String,
altTitle : String,
finalTitle: String,
allDay: boolean
start: Date
end: Date
className: [String]
status: String
eventStatus: String //initial, following, final
marker: String
markerType : String,
phase: String
duration: Number
content: String
followingContent: String
finalContent: String
activity: [{
								"enabled" : true,
								"type" : "book"
						}]

settings: [empty for now]

Markertext removed -> use title
//---------------------------------------------------//
{
				"id": 9,
				"calendarEnabled": true,
				"title": "Meet your Mentor",
				"altTitle" : "You Mentor Meeting",
				"finalTitle": "Review Meeting",
				"allDay": true,
				"start": 1474644345000,
				"end": null,
				"className": ["meeting"],
				"status": "upcoming",
				"eventStatus": "initial", //initial, following, final
				"marker": "standard",
				"markerType" : "secondary",
				"phase": "Step 1",
				"duration": 45,
				"content" : "Book an appoitment with your mentor.",
				"altContent": "Make sure you are ready for your meeting!",
				"finalContent": "This event is all done!",
				"activity": [{
								"enabled" : true,
								"type" : "book"
						}],

				"settings": [{}]
			}
