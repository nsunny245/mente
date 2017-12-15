//Analytics //////////////////////////////////////////////////////////////////////
//																				//
//							Google and inhouse 									//
//	 						 													//
//																				//
/////////////////////////////////////////////////////////////////////////////////
	//Fetch the main report
	router.post('/analytics/getReport', function(req,res){
		console.log("Getting reports");
		if(!req.user){ return res.sendStatus(401); }
		AdminDBCheck(req.user, function(err, success){//Admin check against the database.
			if(!success|| err){
				return res.sendStatus(401);
			}
			console.log("Admin user verified");
			GetSiteData(function(data){
				return res.send(data);
			});
		});
	});