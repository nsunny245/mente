var mongoose = require('mongoose');

var chatContainer = mongoose.Schema({
	chatID : String,//simply created by adding both user's email adresses and converting to ascii, ( mentee + mentor + pastMentees/pastMentors.length )
	mentee: String,
	mentor: String,
	chats:[{
		//chat object:
		//name: String,
		//created: Date,
		//mentorChatStatus: string,//away, online, typing
		//menteeChatStatus: String,//typing, online, away
		//messages[{
		//		chat_message object:
		//		sender: String, 			Who sent the message
		//		content: String, 			The actual message
		//		status: String,				if the message as been read or not.
		//		flag: String, 				Will be used to add urgent/important flag to messages
		//		date: Date
		//}] 
	}]
});


module.exports = mongoose.model('chatContainer', chatContainer);
