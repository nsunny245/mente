module.exports = {
	'session' : {
		'maxAge': 1800000//How long a session lasts in milliseconds
	},
	'tokens':{
		'unverified': 86400000,//how long before delelting unverified accounts in milliseconds.
		'chat': 900000//how long before blocking a user from the chat for inactivity in milliseconds.
	},	

	//TODO : Should go through a mail client. 
	'mailingLists':{
		'admin': ['leoquinttesting@gmail.com'],
		'faculty' : ['leoquinttesting@gmail.com'],
		'feedback' : ['leoquinttesting@gmail.com'],
		'debug': 'leoquinttesting@gmail.com'
	},
	'notifications':{
			'verificationEmail' : "Verification email sent to:"
	},
	'appointments':{
		'autoCompleteDelay' 	: 86400000,//delay before auto completing a meeting.
		'autoCompleteIfEmpty' 	: true,//If the meeting chat is empty should the meeting be auto completed.
		'autoCompleteMinimunChat' : 5//minimum number of chat messages required if we are using !autoCompleteIfEmpty
	},
	'forum':{
		'num_post_loaded_per': 10//How many posts per forum do we send the user on every requests.
	},
	'moduleLoadout':{//Modules added to a mentee/mentor profile upon creation.
		'menteeInTraining': ['mentee intro', 'mentee overview', 'mentee keys to success', 'mentee quiz'],
		'mentorInTraining': ['mentor intro', 'mentor overview', 'mentor keys to success', 'mentor quiz']
	},
	'documentLoadout':{//documents added to mentee/mentor profile
		'menteeInTraining': ['handbook', 'curriculum', 'mentorship'],
		'mentorInTraining': ['handbook', 'mentoringbasics', 'mentorship']
	},
	'documentlinks':{
		//links to documents. Can be outside links
		'brainstorming'			:{	'title':'Brainstorming',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/brainstorming.pdf'
								},
		'curriculum'			:{	'title':'Curriculum',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/curriculum.pdf'
								},
		'handbook'				:{	'title':'Handbook',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/handbook.pdf'
								},
		'hanglingterminations'	:{	'title':'Hangling Terminations',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/hanglingterminations.pdf'
								},
		'improveadvocacy'		:{	'title':'Improve Advocacy',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/improveadvocacy.pdf'
								},
		'keystosuccess'			:{	'title':'Keys to Success',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/keystosuccess.pdf'
								},
		'learn'					:{	'title':'Learn',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/learn.pdf'
								},
		'mentoringbasics'		:{	'title':'Mentoring Basics',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/mentoringbasics.pdf'
								},
		'mentorship'			:{	'title':'Mentorship',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/mentorship.pdf'
								},
		'mybalance'				:{	'title':'My Balance',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/mybalance.pdf'
								},
		'mybody'				:{	'title':'My Body',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/mybody.pdf'
								},
		'myheart'				:{	'title':'My Heart',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/myheart.pdf'
								},
		'mymind'				:{	'title':'My Mind',
									'description':'A document to help with brainstorming',
									'link':'documents/pdf/mymind.pdf'
								}
	}
}
