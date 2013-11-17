var teams = require('../models/team.js');

/*
 * Lists all of the team objects in the database
 */
exports.index = function(req, res) {
	teams.list(function(models){
		res.render('teamIndex', {title:"Listing Teams", teams: models});
	});
}