
//Search routes///////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 						For the main search bar								//
//																				//
//////////////////////////////////////////////////////////////////////////////////

	router.post('/search/forum', function(req,res){
		console.log('checking forums posts');
		discuss.getRecentTopics('myid', {
			'type': 'all',
			'skip': 0,
			'limit': 100
		},
		function (err, result) {
			if(err)
			{
				console.log(err);
				return err;
			}

			res.send(result);
		});

	});