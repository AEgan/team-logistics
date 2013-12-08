var teams = require('../models/team.js');
var team_members = require('../models/team_member.js');
var async = require("async");
var users = require('../models/user.js');
var rides = require('../models/ride.js');
var gm = require('googlemaps');

exports.index = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	teams.find(req.params.name, function(docs) {
		var teamID = docs[0]._id;
		var usernames = [];
		rides.for_event(teamID, req.params.event, function(rideDocs) {
			async.forEach(rideDocs, function(item, callback){
				users.find_by_id(item.driverID, function(model) {
					usernames.push(model.username);
					callback();
				});
			}, function(err){
				res.render('rideIndex', {rides: rideDocs, eventName: req.params.event, team: docs[0], 'usernames': usernames, 'current_user': theUser});
			});
		});
	});
}

exports.create = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	else {
		req.session.warning = "You must log in to do that!";
		return res.redirect('/login');
	}
	var warningMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
		delete req.session.warning;
	}
	teams.find(req.params.name, function(docs) {
		var theTeam = docs[0];
		team_members.user_on_team(theUser._id, theTeam._id, function(models) {
			if(models.length === 0) {
				req.session.warning = "You are not a member of this team, so you cannot create a ride for this event";
				return res.redirect('/');
			}
			else {
				res.render('newRide', {'teamName': req.params.name, 'eventName': req.params.event, 'current_user': theUser, 'warning': warningMessage});
			}
		});
	});
}

exports.insert = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	else {
		req.session.warning = "You must log in to do that!";
		return res.redirect('/login');
	}
	teams.find(req.params.name, function(docs) {
		var teamID = docs[0]._id;
		rides.insert(teamID, req.params.event, theUser._id, req.body.time, req.body.spots, function(result) {
			teams.showEvent(req.params.name, req.params.event, function(team, theEvent) {
				res.redirect('/teams/' + team.name + '/' + theEvent.name);
			});
		});
	});
}

exports.addRideMember = function(req, res) {
	var userID = undefined;
	if(req.session && req.session.user) {
		userID = req.session.user._id;
	}
	else {
		req.session.warning = "You must log in to do that!";
		return res.redirect('/login');
	}
	var data = {};
	team_members.user_on_team(userID, req.body.teamID, function(returnedTeamMembers) {
		if(returnedTeamMembers.length === 0) {
			data.pass = false;
			data.message = "You are not on this team so you can't join this ride";
			res.send(data);
		}
		else {
			rides.rider_can_join(req.body.rideID, userID, function(result) {
				if(result.joined) {
					rides.add_rider_to_ride(req.body.rideID, userID, function(docs) {
						data.pass = true;
						data.message = "You have successfully been added to this ride";
						res.send(data);
					});
				}
				else {
					data.pass = false;
					data.message = result.message;
					res.send(data);
				}
			});
		}
	});
}