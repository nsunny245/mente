//Forum routes////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 		Used for posting/requesting/searching the forum's database.			//
//																				//
//////////////////////////////////////////////////////////////////////////////////

	//Create a new post in the database.
	router.post('/forum/newPost', function(req, res){
		if(!req.user){ return res.sendStatus(401);}
		var p = new forumPost();
		p._id = Date.now() + stringToASCII(req.body.userEmail);
		console.log(asciiToString(p._id) );
		p.authorEmail =  req.body.userEmail;
		p.userType = req.body.userType;
		p.username = req.body.username;
		p.notify = true;
		p.date = Date.now();
		p.subject = req.body.subject;
		p.message = req.body.message;
		p.forumID = req.body.forumID;
		p.tags = req.body.tags;
		p.upVotes = 1;
		p.downVotes = 0;
		p.replies = [];

		p.save(function(err, result){
			console.log(result);
			if(err){
				return res.sendStatus(404);
			}
			res.sendStatus(200);
		});

		userProfile.findOne({'email': req.body.userEmail }, function(err, user){
			var vote = {
				id: p._id,
				value: 1
			};
			user.votes.push(vote);
			user.save(function(err){
			});
		});
	});
	//Selects X amount->(req.body.number) of posts from a specific forum->(req.body.id)
	//starting at index->(req.body.start)
	router.post('/forum/getSelectedPosts', function(req,res){
		console.log(req.body);
		var query = {'forumID':req.body.id};
		var startFrom = req.body.start;
		var limit = req.body.number;
		forumPost.find(query).sort('-date').find(function (err, posts) {
			if(err){
				return res.sendStatus(404);
			}

			posts.splice(0, startFrom);
			if(posts.length > limit)
			{
				posts.splice(0, posts.length - limit)
			}

			//This removes user emails from replies and reports.
			for(var j = 0; j < posts.length; j++)
			{
				//Remove user email from reports and flag it if the requesting user is on the reporting list.
				for(var k = 0; k < posts[j].reports.length; ++k)
				{
					if(req.user && posts[j].reports[k].email == req.user.email)
					{
						posts[j].reports[k].hasReported = true;
					}
					posts[j].reports[k].email = null;
				}
				for(var k = 0; k < posts[j].replies.length; ++k)
				{
					//TODO
					posts[j].replies[k].userEmail = null;
					//removes the emails of reports from replies
					for(var l = 0; l < posts[j].replies[k].reports.length; ++l)
					{
						if(req.user && posts[j].replies[k].reports[l].email == req.user.email)
						{
							posts[j].replies[k].reports[l].hasReported = true;
						}
						posts[j].replies[k].reports[l].email = null;
					}
				}
			}
			return res.send(posts);
		})//The minus select removes authrEmail from the information sent to client.
		//.select("-authorEmail"); TODO...why?

	});

	//delete post

	router.post('/forum/delete', (req, res) => {
		if (!req.user) {return res.sendStatus(401)}
		var postQuery = {'_id': req.body.postId}
		var replyId = req.body.replyId;

		if (typeof replyId == 'undefined' || replyId == null) {
			console.log('no reply id');
			forumPost.findOneAndRemove(postQuery, (err, result) => {
				if (err) {
					console.log('encountered error while removing');
					return res.sendStatus(401);
				} else {
					return res.sendStatus(200);
				}
			});
		} else {
			console.log('postId: ',req.body.postId);
			console.log('replyId: ',replyId);
			forumPost.findOne(postQuery, function(err, post){
				console.log(post);
				if (err) {
					console.log('encountered error while removing: could not find parent post of reply');
					return res.sendStatus(401);
				} else {
					console.log("at for loop")
					for (let i=0; i<post.replies.length; ++i) {
						if (post.replies[i]._id == replyId) {
							console.log('found reply');
							post.replies.splice(i,1);
							break;
						}
					}
					post.save(function(err){
						if(err){
							return res.sendStatus(400);
						}
						console.log('deleted');
						return res.sendStatus(200);
					});
				}
			});
		}
	});
	
	router.get('/forum/receiveUnsub', function (req, res) {
		//need to validate user account here. Removal will be automated after 24h.
		sourceVerify(function (temp) {
			console.log("I GOT TO INSIDE VERIFICATION");
			console.log(temp);
			forumPost.findOne({ '_id': temp.postId }, function (err, post) {
				if (err) {
					console.log("ERROR:  " + err.toString());
				}
				else {
					var email = temp.email;
					if (email == post.authorEmail) {
						post.notify = false;
					}
					for (let i=0; i < post.replies.length; ++i) {
						if (email == post.replies[i].userEmail) {
							post.replies[i].notify = false;
						}
					}
					console.log("SET NOTIFICATIONS ",false);

					post.save(function(err){
						if(err){
							console.log("error saving to profile");
						} else {
							res.send("<head><meta http-equiv='refresh' content='5;url=http://" + host + "/#/community/forums' /></head><h3 style='text-align:center;'>Your have successfully unsubscribed from this post.<br>You will be redirected momentarily.</h3>");
						}
					});
				}

			});
		}, req, res);
	});

	router.post('/forum/toggleNotifications', function(req, res) {
		if(!req.user){ return res.sendStatus(401);}

		var postId = req.body.postId;
		var email = req.user.email;
		let query = { '_id': postId };

		forumPost.findOne(query, function(err, post){
			if(err){
				return res.status(401);
			}

			var setNotify = null;
			if (email == post.authorEmail) {
				setNotify = ! post.notify;
				post.notify = setNotify;
			}
			var i = 0;
			for (; setNotify == null && i < post.replies.length; ++i) {
				if (email == post.replies[i].userEmail) {
					setNotify = ! post.replies[i].notify;
				}
			}
			for (; i < post.replies.length; ++i) {
				if (email == post.replies[i].userEmail) {
					post.replies[i].notify = setNotify;
				}
			}

			console.log("SET NOTIFICATIONS ",setNotify);

			post.save(function(err){
				if(err){
					return res.sendStatus(400);
				}
				return res.sendStatus(200);
			});
		});
	});

	//TODO PULL FOR REPLYS

	//Adds a reply to the specific post.
	router.post('/forum/reply', function(req,res){
		var postId = req.body.id;
		console.log(req.body);
		if(!req.user){ return res.sendStatus(401);}
		var query = {'_id':postId};

		forumPost.findOne(query, function(err, post){
			if(err){
				return res.status(401);
			}
			console.log("Post found reply results: " + post);


			//see schema in post.js
			var reply = {
				_id: req.body.id + "#" + GenString(10),//made up of the post id + random string
				message : req.body.message,
				username : req.user.username,
				userType: req.user.status,
				userEmail: req.user.email,
				notify: true,
				upVotes: 1,
				downVotes: 0,
				date: req.body.date,
				reports: []
			}
			post.replies.push(reply);
			post.save(function(err){
				if(err){
					return res.sendStatus(400);
				}
				return res.sendStatus(200);
			});

			var vote = {
				id: reply._id,
				value: 1
			};
			req.user.votes.push(vote);
			req.user.save(function(err){
				// if(err){
				// 	return res.sendStatus(401);
				// }
				// return res.sendStatus(200);
			});

			var replyData = {
				message : reply.message,
				username: reply.username
			};
			if (post.notify) {
				var postData = {
					id: postId,
					email: post.authorEmail,
					subject: post.subject
				}
				SendPostResponseEmail(req, res, function (error) {
					if (error) {
						console.log("errored sending reply email to OP");
						//return res.sendStatus(400);
					}
					console.log("sent reply email to OP");
					//return res.sendStatus(200);
				}, replyData, postData);
			}

		});

	});
	///*****************VOTING********************///
	//The vote is added to the tally on the post and a vote object is added to the user.
	//The vote object has the post's id and the value -> either 1 or -1 if its an up/down vote.
	//The same is true for up/down voting replies.
	router.post('/forum/castVote', function(req, res){
		console.log(req.body);
		if(!req.user){ return res.sendStatus(401);}
		var subStrStart = req.body.id.indexOf('#');
		var query;
		var isReply = false;
		if(subStrStart != -1){//replie
			query = {'_id': req.body.id.slice(0, subStrStart)};
			isReply = true;
		}
		else{
			query = {'_id':req.body.id};
		}

		forumPost.findOne(query, function(err, result){
			if(err){
				return res.sendStatus(401);
			}

			if(isReply){
				var index = result.replies.map(function(e){return e._id;}).indexOf(req.body.id);
				if(index == -1){
					return res.sendStatus(400);
				}

				if(req.body.newVote){//if this is a new vote
					if(req.body.vote === 1){
						result.replies[index].upVotes++;
					}
					else {
						result.replies[index].downVotes++;
					}
				}
				else {
					if(req.body.prevVote === 1){//else changing from a downvote to upvote
						result.replies[index].upVotes--;
						if (req.body.vote === -1) {
							result.replies[index].downVotes++;
						}
					}
					else {//else changeing from upvote to downvote
						result.replies[index].downVotes--;
						if (req.body.vote === 1) {
							result.replies[index].upVotes++;
						}
					}
				}
				result.markModified('replies');
			}
			else {
				if (req.body.newVote){//if this is a new vote
					if(req.body.vote === 1){
						result.upVotes++;
					}
					else {
						result.downVotes++;
					}
				}
				else {
					if(req.body.prevVote === 1){//else changing from a downvote to upvote
						result.upVotes--;
						if (req.body.vote === -1) {
							result.downVotes++;
						}
					}
					else {//else changeing from upvote to downvote
						result.downVotes--;
						if (req.body.vote === 1) {
							result.upVotes++;
						}
					}
				}
			}

			result.save(function(err){
				if(err){
					return res.sendStatus(400);
				}
				userProfile.findOne({'email': req.user.email }, function(err, user){
					if(err){
						return res.sendStatus(400);
					}
					if(!user){
						return res.sendStatus(400);
					}
					//if this is the user's first vote on this subject.
					//Create a new vote object on the user.
					console.log("SHOULD BE SAVING VOTE HERE");
					if(req.body.prevVote === null || typeof req.body.prevVote === undefined){
						console.log("READYING OBJECT");
						var vote = {
							id: req.body.id,
							value: req.body.vote
						};
						console.log(vote);
						user.votes.push(vote);
						user.save(function(err){
							if(err){
								return res.sendStatus(401);
							}
							console.log(user.votes[user.votes.length-1]);
							return res.sendStatus(200);
						});
					}
					//If this is a revote we just want to edit the values.
					else{
						var index = user.votes.map(function(e){
							return e.id;
						}).indexOf(req.body.id);

						console.log("Index OF VOTE:" +index);
						user.votes[index].value = req.body.vote;
						user.markModified('votes');
						user.save(function(err){
							if(err){
								return res.sendStatus(401);
							}
							return res.sendStatus(200);
						});
					}

				});

				// forumPost.findOne({"_id": req.body._id}, function(err, doc){
				// 	if(err || !doc) {
				// 		return res.sendStatus(400);
				// 	}
				// 	doc.remove(function(err){
				// 		if(err){ return res.sendStatus(400);}
				// 		return res.send(true);
				// 	});

				// });


			});

		});

	});
	//Report a post
	router.post('/forum/reportPost', function(req, res){
		console.log(req.body);
		if(!req.user){return res.sendStatus(401)};
		var subStrStart = req.body.id.indexOf('#');
		if(subStrStart != -1){//replie
			var query = {'_id': req.body.id.slice(0, subStrStart)};
			forumPost.findOne(query, function(err, result){
				if(err){
					return res.sendStatus(401);
				}
				//find the index of the replie/report
				var index = result.replies.map(function(e){return e._id;}).indexOf(req.body.id);
				if(index == -1){
					return res.sendStatus(400);
				}
				var report = {
					email : req.user.email,
					reason : req.body.reason
				}
				result.replies[index].reports.push(report);

				result.save(function(err){
					if(err){
						return res.sendStatus(400);
					}
					return res.sendStatus(200);
				});

			});
		}
		else{//Regular post
			var query = {'_id':req.body.id};
			forumPost.findOne(query, function(err, result){
				if(err){
					return res.sendStatus(401);
				}
				var report = {
					email : req.user.email,
					reason : req.body.reason
				}
				result.reports.push(report);
				result.save(function(err){
					if(err){
						return res.sendStatus(400);
					}
					return res.sendStatus(200);
				});

			});
		}

	});

	
	const reportCountMax = 3; //maximum number of reports before a post is automatically hidden

	router.post('/forum/subPostCount', function (req, res) {
		const postIdToLoad = req.body.postIdToLoad;
		const dbRangeQuery = { 'forumID': postIdToLoad };
		forumPost.find(dbRangeQuery).sort('-date').find(function (err, posts) {
			if (err) {
				return res.sendStatus(404);
			}
			var visibleCount = posts.length;
			// for (var i=0; i<posts.length; i++) {
			// 	if (posts[i].reports.length >= reportCountMax) {
			// 		visibleCount--;
			// 	}
			// }
			var count = {
				'val': visibleCount
			};
			return res.send(count);
		});
	});

	function sortByPopularity(a,b,inflateNew) {
		var currentDate = Date.now();
		var conversionFactor = 10;// * (365/12); //s > week // month
		var athVitality = calcVitality(a); //what do you call this?
		var bthVitality = calcVitality(b);

		return athVitality - bthVitality;

		function calcVitality(post) {
			var decay = conversionFactor; //12.5h > change to 1w

			var postDate = new Date(post.date);
			postDate = postDate.getTime();

			var s = post.upVotes - post.downVotes
			, order = Math.log(Math.max(Math.abs(s), 1)) / Math.LN10
			, secAge = (currentDate - postDate) / 1000;

			return order - secAge / decay;
		}
	}

	router.post('/forum/getPostById', function (req, res) {
		console.log("POSTID",req.body.postId);
		const dbRangeQuery = { '_id': req.body.postId };
		forumPost.findOne(dbRangeQuery, function (err, post) {
			if (err) {
				return res.sendStatus(404);
			}
			console.log(post);

			var shouldNotify = false;
			var subbed = true;

			//POST
			if (req.user && post.authorEmail == req.user.email) {
				shouldNotify = true;
				subbed = post.notify;
			} else {
				post.authorEmail = null;
			}


			//REPLIES
			post.replies.sort(function(a,b) { return sortByPopularity(a,b,false);});

			var filteredReplies = [];
			var repliesMeta = [];
			for (var k = 0; k < post.replies.length; ++k) {
				if (post.replies[k].reports.length >= reportCountMax) {
					continue;
				}

				if (req.user) {
					console.log(true);
					console.log(post.replies[k].userEmail, req.user.email);
				} else {
					console.log(false);
				}
				if (req.user && post.replies[k].userEmail == req.user.email) {
					shouldNotify = true;
					subbed = post.replies[k].notify;
				} else {
					post.replies[k].userEmail = null;
				}

				var isReported = false;
				for(var l = 0; l < post.replies[k].reports.length; ++l) {
					if(req.user && post.replies[k].reports[l].email == req.user.email) {
						isReported = true;
					} else {
						post.replies[k].reports[l].email = null;
					}
				}

				filteredReplies.push(post.replies[k]);
				repliesMeta.push({
					'currentVote': null,
					'isReported': isReported
				});
			}
			post.replies = filteredReplies;

			//REPORTS
			var isReported = false;
			for(var k = 0; k < post.reports.length; ++k) {
				if(req.user && post.reports[k].email == req.user.email) {
					isReported = true;
				} else {
					post.reports[k].email = null;
				}
			}

			//OBJECT TO RETURN
			post = {
				'data': post,
				'meta': {
					'currentVote': null,
					'isReported': isReported,
					'shouldNotify': shouldNotify,
					'subbed': subbed,
					'replies': repliesMeta
				}
			};

			return res.send(post);
		});
	});

	router.post('/forum/getRangeOfPosts', function (req, res) {
		const postIdToLoad = req.body.postIdToLoad;
		const dbRangeQuery = { 'forumID': postIdToLoad };
		forumPost.find(dbRangeQuery).sort('-date').find(function (err, posts) {
			if (err) {
				return res.sendStatus(404);
			}

			//sorting by popularity
			var popularitySort = req.body.sortByPopularity;
			if (popularitySort) {
				posts.sort(function(a,b) { return sortByPopularity(a,b,true);});
			}

			var rangeStart = req.body.rangeStart;
			var rangeEnd = req.body.rangeEnd;

			var fetchedPosts = [];
			for (var j = rangeStart; j < rangeEnd && j < posts.length; ++j) {

				// if (posts[j].reports.length >= reportCountMax) {
				// 	rangeEnd++;
				// 	continue;
				// }

				var shouldNotify = false;
				var subbed = true;

				//POST
				if (req.user && posts[j].authorEmail == req.user.email) {
					shouldNotify = true;
					subbed = posts[j].notify;
				} else {
					posts[j].authorEmail = null;
				}

				//REPLIES
				posts[j].replies.sort(function(a,b) { return sortByPopularity(a,b,false);});

				var filteredReplies = [];
				var repliesMeta = [];
				for (var k = 0; k < posts[j].replies.length; ++k) {
					if (posts[j].replies[k].reports.length >= reportCountMax) {
						continue;
					}

					if (req.user) {
						console.log(true);
						console.log(posts[j].replies[k].userEmail, req.user.email);
					} else {
						console.log(false);
					}
					if (req.user && posts[j].replies[k].userEmail == req.user.email) {
						shouldNotify = true;
						subbed = posts[j].replies[k].notify;
					} else {
						posts[j].replies[k].userEmail = null;
					}

					var isReported = false;
					for(var l = 0; l < posts[j].replies[k].reports.length; ++l) {
						if(req.user && posts[j].replies[k].reports[l].email == req.user.email) {
							isReported = true;
							break;
						}
					}

					filteredReplies.push(posts[j].replies[k]);
					repliesMeta.push({
						'currentVote': null,
						'isReported': isReported
					});
				}
				posts[j].replies = filteredReplies;

				// REPORTS
				var isReported = false;
				for(var k = 0; k < posts[j].reports.length; ++k) {
					if(req.user && posts[j].reports[k].email == req.user.email) {
						isReported = true;
					} else {
						posts[j].reports[k].email = null;
					}
				}

				//OBJECT TO RETURN
				posts[j] = {
					'data': posts[j],
					'meta': {
						'currentVote': null,
						'isReported': isReported,
						'shouldNotify': shouldNotify,
						'subbed': subbed,
						'replies': repliesMeta
					}
				};
				fetchedPosts.push(posts[j]);
			}
			return res.send(fetchedPosts);
		});
	});


	//Load the initial posts on load
	router.post('/forum/getInitialPosts', function(req, res){
		console.log("Loading initial posts");
		console.log(req.body);
		console.log(user);
		var initialPosts = [];
		var limit = req.body.numberLoaded;
		for(var i = 0; i < req.body.numberOfForums; ++i)
		{

			var query = {'forumID': i/*Query*/};

			//This format of querry sorts the data based on the date field from
			//most recent to oldest
			forumPost.find(query).sort('-date').find(function (err, posts) {
				if(err){
					return res.sendStatus(404);
				}
				if(!posts){
					//return true;
					//TODO find a solution so that an empty forum doesnt break everything
				}
				//This removes user emails from replies and reports.
				for(var j = 0; j < posts.length; j++)
				{
					//Remove user email from reports and flag it if the requesting user is on the reporting list.
					for(var k = 0; k < posts[j].reports.length; ++k)
					{
						if(req.user && posts[j].reports[k].email == req.user.email)
						{
							posts[j].reports[k].hasReported = true;
						}
						posts[j].reports[k].email = null;
					}
					for(var k = 0; k < posts[j].replies.length; ++k)
					{
						//TODO: need email so you can delete own post!
						posts[j].replies[k].userEmail = null;
						//removes the emails of reports from replies
						for(var l = 0; l < posts[j].replies[k].reports.length; ++l)
						{
							if(req.user && posts[j].replies[k].reports[l].email == req.user.email)
							{
								posts[j].replies[k].reports[l].hasReported = true;
							}
							posts[j].replies[k].reports[l].email = null;
						}
					}

					/* getting all meta */
					var repliesMeta = [];
					for (var k = 0; k < posts[j].replies.length; ++k) {
						var isReported = false;
						for(var l = 0; l < posts[j].replies[k].reports.length; ++l) {
							if(req.user && posts[j].replies[k].reports[l].email == req.user.email) {
								isReported = true;
								break;
							}
						}
						repliesMeta[k] = {
							'currentVote': posts[j].replies[k].previousVote,
							'isReported': isReported
						}
					}
					var isReported = false;
					for(var k = 0; k < posts[j].reports.length; ++k) {
						if(req.user && posts[j].reports[k].email == req.user.email) {
							isReported = true;
							break;
						}
					}
					posts[j] = {
						'data': posts[j],
						'meta': {
							'currentVote': posts[j].previousVote,
							'isReported': isReported,
							'replies': repliesMeta
						}
					};
				}
				try {
					initialPosts[posts[0].data.forumID] = posts;
				} catch(e) {
					console.log("ERROR", e);
					return
				}
				var isFinished = true;
				//check if all the forums are loaded
				for(var l = 0; l < req.body.numberOfForums; ++l)
				{
					console.log("loaded posts", l);
					//console.log(initialPosts[l]);
					for (var propName in initialPosts[l]) {
						console.log(propName);
					}
					if(initialPosts[l] == null)
					{
						isFinished = false;
						break;
					}
				}
				if(isFinished){
					console.log("FINISHED!");
					return res.send(initialPosts);
				}
			})//The minus select removes authrEmail from the information sent to client.
			//.select("-authorEmail"); TODO ..why again

		}

	});
	//Temp maintenance route TODO fix
	router.post('/forum/initialize', function(req,res){
		if(!req.user || req.user.status != 'admin'){
			return res.sendStatus(401);
		}
		var count = 0;
		var success = 0;
		for(var i = 0; i < req.body.numberToInit; i++)
		{
			var p = new forumPost();
			p._id = Date.now() + stringToASCII("admin@mail.com");
			console.log(asciiToString(p._id) );
			p.authorEmail =  "CommunAbility team";
			p.userType = "Admin";
			p.username = "CommunAbility team";
			p.date = Date.now();
			p.subject = "Welcome";
			p.message = "";
			p.forumID = i;
			p.tags = [];
			p.upVotes = 0;
			p.downVotes = 0;
			p.replies = [];

			p.save(function(err, result){
				count++;
				if(err){
					console.log("ERROR: " + err);
				}
				else{
					success++;
				}
				if(count == req.body.numberToInit)
				{
					return res.send("initialized " + success + " " + count);
				}
			});
		}
	});