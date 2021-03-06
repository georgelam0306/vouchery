var linksController = require('./linkController.js')

/**
 * Description
 * @method exports
 * @param {} app
 * @param {} passport
 * @return 
 */
module.exports = function(app, passport) {
	//api/links/myLinks
	//Server receives request for user's posted links
	app.use('/', passport.authenticate('facebook-token', {session:false}));

	app.get('/myLinks', linksController.fetchMyLinks);

	//Server receives request for links of user's friends
	app.get('/friendsLinks', linksController.fetchFriendsLinks);

	//server receives post request when user submits link
	app.post('/newLink', linksController.postLink);

	app.get('/userDisplayName', linksController.fetchUserName);


}
