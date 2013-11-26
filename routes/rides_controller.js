var teams = require('../models/team.js');
var async = require("async");
var users = require('../models/user.js');
var rides = require('../models/ride.js');
var gm = require('googlemaps');

exports.index = function(req, res) {
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
				res.render('rideIndex', {rides: rideDocs, eventName: req.params.event, team: docs[0], 'usernames': usernames});
			});
		});
	});
}

exports.create = function(req, res) {
	res.render('newRide', {'teamName': req.params.name, 'eventName': req.params.event});
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