var team_members = require('../models/team_member.js');
var teams = require('../models/team.js');
/*
 * Renders page to add a new member
 */
exports.newMember = function(req, res) {
	res.render('newMember');
}

exports.addMember = function(req, res) {
	var userID = req.body.userID;
	var teamID = req.body.teamID;
	var date = Date();
	team_members.insert(teamID, userID, date, function(model) {
		res.render('index');
	});
}