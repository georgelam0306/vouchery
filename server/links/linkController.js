var db = require('../db');


module.exports = { 
	fetchUserName: function(req, res, next){
		console.log("*** got to the server");
		var user = req.user[0].dataValues.fbID;
		db.User.findOne({where: {fbID: user}})
			.then(function(user) {
				res.json({userDisplayName : user.fbName});
			});
	},

	/**
	 * Description
	 * @method fetchMyLinks
	 * @param {} req
	 * @param {} res
	 * @param {} next
	 * @return 
	 */
	fetchMyLinks: function(req, res, next){

		var user = req.user[0].dataValues.fbID;
		console.log(user);
		db.User.findOne({where: {fbID: user}})
			.then(function(user) {
				console.log(user);
				db.Link.findAll({where: 
					{
						UserId: user.dataValues.id
					}
				}).then(function(results){

					res.json(results.map(function(element){
						return {
							promoLink: element.promoLink,
							updatedAt: element.updatedAt
						}
					}));
				});
			});
	},

	/**
	 * Description
	 * @method fetchFriendsLinks
	 * @param {} req
	 * @param {} res
	 * @param {} next
	 * @return 
	 */
	fetchFriendsLinks: function(req, res, next){
		var user = req.user[0].dataValues.fbID;

		db.FriendsList.findAll({where:{friendAiD: user}})
			.then(function(friends){
				if(friends) {
					friends = friends.map(function(friend){
						return friend.dataValues.friendBiD;
					});



					var postedLinks = [];


					db.User.findAll({where: {fbID: friends}}).
					 then(function(users) {
					 	console.log("**********fatcat******");
					 	console.log(users);

					 	if(users) {

					 		users = users.map(function(user){
					 			return user.dataValues.id
					 		});

					 		console.log(users);

					 		db.Link.findAll({where: {UserId: users}}).
					 			then( function(result){
					 				console.log("*****RESULTS******");
					 				console.log(result);


					 				postedLinks = postedLinks.concat(result.map(function(ele){
					 					return {
					 						userName: ele.dataValues.fbName,
					 						promoLink: ele.dataValues.promoLink,
					 						updatedAt: ele.dataValues.updatedAt
					 					}

					 				}));
					 				console.log( "***** POSTED LINKS WAHAHAH");
					 				console.log(postedLinks);
					 				res.json(postedLinks);

					 			});
					 	}else {

					 	}

					 });
				} else {
					res.json("[]");
				}

			});


	},

	/**
	 * Description
	 * @method postLink
	 * @param {} req
	 * @param {} res
	 * @param {} next
	 * @return 
	 */
	postLink: function(req, res, next){

		var link = req.body.link;
		var fbID = req.user[0].dataValues.fbID;

		db.User.findOrCreate({where: {fbID: fbID}})
			.then(function(user){
				db.Link.findOrCreate({where: 
					{
						fbName: user[0].dataValues.fbName,
						UserId: user[0].dataValues.id,
						promoLink: link
					}
				}).then(function(results){
					res.sendStatus(201);
				});
			});
	}

};