var team_members = require('../models/team_member.js');
var teams = require('../models/team.js');
var users = require('../models/user.js');
/*
 * Renders page to add a new member
 */
exports.newMember = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	if(theUser) {
		teams.list(function(teams) {
			users.all(function(users) {
				res.render('newMember', {"current_user": theUser, "users": users, "teams": teams, "warning": undefined});
			});
		});
	}
	else {
		req.session.warning = "You must be logged in to do that";
		res.redirect('/login');
	}
}

exports.addMember = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	else {
		req.session.warning = "You must be logged in to do that";
		return res.redirect('/login');
	}
	var userID = req.body.userID;
	var teamID = req.body.teamID;
	var date = Date();
	team_members.insert(teamID, userID, date, function(model) {
		req.session.success = "You have successfully added a new member to the team";
		res.redirect('/');
	});
}