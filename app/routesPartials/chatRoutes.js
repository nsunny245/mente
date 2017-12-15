//Chat routes/////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 			Used for live chat between mentor and mentee					//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	router.post('/chat/login', function(req,res, next){
		if(!req.user){
			return res.sendStatus(401);
		}
		passport.authenticate('chat-login', function(err, user, info){
			if(err){
				return next(err);
			}
			if(!user){
				return res.send(false);
			}
			var newStamp = new timestampModel();
			var d = new Date();
			newStamp.date = d.getTime();
			newStamp.duration = configParams.tokens.chat;
			newStamp.email = req.user.email;
			newStamp.save(function(err){
				if(err){
					return err;
				}
				console.log("timestamp saved");

			});
			return res.send(true);
		})(req, res, next);
	});
	router.post('/chat/Update', function(req, res){
		if(!req.user){
			console.log("User not logged in");
			return res.sendStatus(401);
		}


		GetChatContainer(req.body.mentor, req.body.mentee, req.body.index, function(err, chatCTN){
			if(err) {
				return err;
			}
			if(!chatCTN) {
				return null;
			}

			timestampModel.findOne({'email': req.user.email}, function(err, doc){
				if(err){
					return err;
				}
				if(!doc){
					return res.sendStatus(401);
				}
				if(!doc.validate){
					console.log("time stamp expired!");
					return res.sendStatus(401);
				}
				var d = new Date();
				doc.date = d.getTime();
				doc.save(function(err){
					if(err){return err;}
					console.log("Refreshing token");
					return res.send(chatCTN);
				});

			});

		});
	});
	//Updates the status of a chat to display if the user is typing at the momment.
	router.post('/chat/updateStatus', function(req,res){
		if(!req.user){return res.sendStatus(401);}


		chatContainer.findOne({'chatID': req.body.chatID}, function(err, chatCTN){
			if(err){
				return res.sendStatus(400);
			}
			if(!chatCTN){
				return res.sendStatus(400);
			}
			if(req.body.chatID === "all"){
				if (isMentee) {
					for(var i = 0; i < chatCTN.chats.length; i++) {
						chatCTN.chats[i].menteeChatStatus = req.body.status;
					}
				} else {
					for(var i = 0; i < chatCTN.chats.length; i++) {
						chatCTN.chats[i].mentorChatStatus = req.body.status;
					}
				}
				chatCTN.markModified('chats');
				chatCTN.save();
			}
			else if (isMentee && chatCTN.chats[req.body.chatID].menteeChatStatus != req.body.status || !isMentee && chatCTN.chats[req.body.chatID].mentorChatStatus != req.body.status){
				if (isMentee) {
					chatCTN.chats[req.body.chatID].menteeChatStatus = req.body.status;
				} else {
					chatCTN.chats[req.body.chatID].mentorChatStatus = req.body.status;
				}
				chatCTN.markModified('chats');
				chatCTN.save();
			}
			return;
		});
	});
	router.get('/chat/checkForNewMessages', function(req,res){
		var updatedTime = new Date(req.session.cookie._expires);
		var newnewDate = new Date(updatedTime.getTime()-1000);


		if(!req.user){ return res.sendStatus(401); }
		var menteeUser = [];
		var mentorUser;
		var callingUser;

		if(req.user.status === 'mentee'){
			menteeUser.push(req.user.email);
			mentorUser = req.user.mentee[0].mentor;
			callingUser = req.user.mentee[0].firstName + " " + req.user.mentee[0].lastName;
		}
		else if(req.user.status === 'mentor' ||req.user.status === 'mentorFull'){
			for(var i = 0; i < req.user.mentor[0].mentees.length; i++){
				menteeUser.push(req.user.mentor[0].mentees[i]);
			}
			mentorUser = req.user.email;
			callingUser = req.user.mentor[0].firstName + " " + req.user.mentor[0].lastName;
		}
		GetNewMessageCountAndStatus(menteeUser, mentorUser, callingUser, function (err, newMessagesCounts, chatStatuses) {
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			}
			if (req.user.status === 'mentee') {
				return res.send({ messages: newMessagesCounts, chatStatus: chatStatuses[2] });
			}
			return res.send({ messages: newMessagesCounts, chatStatus: [chatStatuses[0], chatStatuses[1]] });

		});
	});

	router.post('/chat/Post', function(req,res){
		console.log(req.body);
		GetChatContainer(req.body.mentee, req.body.mentor, -1, function(err, chatCTN){
			console.log(stringToASCII(req.body.mentee + req.body.mentor) + ' ' + chatCTN);
			if(err)
			{
				return err;
			}
			if(!chatCTN)
			{
				return res.send(400);
			}
			console.log('posting new message');
			console.log(chatCTN);


			var messageIndex = chatCTN.chats[req.body.chatIndex].messages.length;
			var chatPos = req.body.chatIndex;

			chatCTN.chats[req.body.chatIndex].messages.push({
			'sender': req.body.message.sender,
			'content': req.body.message.content,
			'status': req.body.message.status,
			'flag': req.body.message.flag,
			'id': messageIndex,
			'date': Date.now()

			});
			//chatCTN.chat.last = Date.now();

			chatCTN.markModified('chats');
			chatCTN.save();


			res.send(chatCTN);
		});
	});
	router.post('/chat/MarkAsRead', function(req, res){
		console.log(req.body);

		chatContainer.findOne({'chatID': req.body.chatid}, function(err, chatCTN){
			if(err)
			{
				return err;
			}
			if(!chatCTN)
			{
				return res.sendStatus(400);
			}
			console.log('updating status');
			console.log(chatCTN);

			chatCTN.chats[req.body.chatIndex].messages[req.body.msgIndex].status = 'read';


			chatCTN.markModified('chats');
			chatCTN.save();


			res.send(chatCTN);
		});
	});