var team_members = require('../models/team_member.js');
var teams = require('../models/team.js');
/*
 * Renders page to add a new member
 */
exports.newMember = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	if(theUser) {
		res.render('newMember', {"current_user": theUser});
	}
	else {
		res.redirect('login', {current_user: theUser, warning: 'You must be logged in to do that!'});
	}
}

exports.addMember = function(req, res) {
	var userID = req.body.userID;
	var teamID = req.body.teamID;
	var date = Date();
	team_members.insert(teamID, userID, date, function(model) {
		res.render('index');
	});
}