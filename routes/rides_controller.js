var teams = require('../models/team.js');
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
	res.render('newRide', {'teamName': req.params.name, 'eventName': req.params.event, 'current_user': theUser, 'warning': warningMessage});
}

exports.insert = function(req, res) {
	teams.find(req.params.name, function(docs) {
		var teamID = docs[0]._id;
		rides.insert(teamID, req.params.event, req.body.driverID, req.body.time, req.body.spots, function(result) {
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
	rides.add_rider_to_ride(req.body.rideID, userID, function(docs) {
		res.send('in the function to addd a member to a ride with the ID ' + req.body.rideID + " and the user id is " + userID);
	});
}