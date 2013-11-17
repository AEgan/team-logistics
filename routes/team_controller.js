var teams = require('../models/team.js');

/*
 * Lists all of the team objects in the database
 */
exports.index = function(req, res) {
	teams.list(function(models){
		res.render('teamIndex', {title:"Listing Teams", teams: models});
	});
}

 /*
  * renders a page to create a new team
  */
exports.newTeam = function(req, res) {
	res.render('newTeam');
}

 /*
  * Inserts a new team
  */
exports.insert = function(req, res) {
	var name = req.body.name;
	var sport = req.body.sport;
	var coach = req.body.coach;
	var active = true;
	if(req.body.active == "on") {
		active = true;
	}
	else {
		active = false;
	}
	teams.insert(name, sport, coach, active, function(model) {
		res.render('teamPage', {obj: model});
	});
}

 /*
  * shows a team
  */
exports.show = function(req, res) {
	var username = req.params.name;
	teams.show(username, function(model) {
		res.render('teamPage', {team: model});
	});
}
