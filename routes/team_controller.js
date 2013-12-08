var teams = require('../models/team.js');
var team_members = require('../models/team_member.js');
var async = require("async");
var users = require('../models/user.js');
var gm = require('googlemaps');
var rides = require('../models/ride.js');
/*
 * Lists all of the team objects in the database
 */
exports.index = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	teams.list(function(models){
		res.render('teamIndex', {title:"Listing Teams", teams: models, 'current_user': theUser, warning: undefined, success: undefined});
	});
}

 /*
  * renders a page to create a new team
  */
exports.newTeam = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	if(theUser) {
		var warningMessage = undefined;
		if(req.session.warning) {
			warningMessage = req.session.warning;
			delete req.session.warning;
		}
		res.render('newTeam', {current_user: theUser, warning: warningMessage});
	}
	else {
		req.session.warning = "You must log in to do that!";
		return res.redirect('/login');
	}
}

 /*
  * Inserts a new team
  */
exports.insert = function(req, res) {
	var name = req.body.name;
	var sport = req.body.sport;
	var coach = req.body.coach;
	if(!name || name == '') {
		return res.render('newTeam', {'current_user': req.session.user, 'warning': 'You must enter a team name'});
	}
	else {
		teams.find(name, function(docs) {
			if(docs.length != 0) {
				return res.render('newTeam', {'current_user': req.session.user, 'warning': "This team name has already been taken"});
			}
			else {
				var warningMessage = undefined;
				if(!sport || sport == '') {
					if(!warningMessage) {
						warningMessage = "You must enter a sport for this team";
					}
					else {
						warningMessage += ", you must enter a sport for this team";
					}
				}
				if(!coach || coach == '') {
					if(!warningMessage) {
						warningMessage = "You must enter a coach name for this team";
					}
					else {
						warningMessage += ", you must enter a coach name for this team";
					}
				}
				var active = true;
				if(req.session.user.role == 'admin') {
					if(req.body.active == "on") {
						active = true;
					}
					else {
						active = false;
					}
				}
				if(warningMessage) {
					return res.render('newTeam', {'current_user': req.session.user, 'warning': warningMessage});
				}
				else {
					teams.insert(name, sport, coach, active, function(model) {
						res.render('teamPage', {team: model, warning: undefined, success: "Team successfully created", members: undefined, 'current_user': req.session.user});
					});
				}
			}
		});
	}
}

 /*
  * shows a team
  */
exports.show = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	var warningMessage = undefined;
	var successMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
		delete req.session.warning;
	}
	if (req.session && req.session.success) {
		successMessage = req.session.success;
		delete req.session.success;
	}
	var username = req.params.name;
	var returnedUsers = [];
	teams.show(username, function(model) {
		team_members.for_team(model._id, function(docs) {
			async.forEach(docs, function(item, callback) {
				
				users.find_by_id(item.userID, function(item) {
					returnedUsers.push(item);
					callback();
				});
			}, function(err) {
			res.render('teamPage', {'team': model, 'members': returnedUsers, 'current_user': theUser, 'warning': warningMessage, 'success': successMessage});
			});
		});
	});
}

/*
 * goes to a new event page
 */
exports.newEventPage = function(req, res) {
	var name = req.params.name;
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	else {
		req.session.warning = "You must be logged in to create a new event";
		return res.redirect('/login');
	}
	var warningMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
		delete req.session.warning;
	}
	teams.find(name, function(model) {
		team_members.user_on_team(theUser._id, model[0]._id, function(docs) {
			if(docs.length === 0) {
				req.session.warning = "You must be a member of this team to do that"
				return res.redirect('/');
			}
			else {
				res.render('newEvent', {"team": model[0], "current_user": theUser, 'warning': warningMessage});
			}
		});
	}); 
	
}

/*
 * posts a new event
 */
exports.postNewEvent = function(req, res) {
	var name = req.body.name;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var teamName = req.body.teamName;
	var datetime = req.body.datetime;
	teams.addEvent(name, street, city, state, zip, teamName, datetime, function(response) {
		res.render('eventShow');
	});
}

exports.showEvent = function(req, res) {
	var eventName = req.params.event;
	var teamName = req.params.name;
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	var warningMessage = undefined;
	var successMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
		delete req.session.warning;
	}
	if(req.session && req.session.success) {
		successMessage = req.session.success;
		delete req.session.success;
	}
	teams.showEvent(teamName, eventName, function(team, theEvent) {
		var address = "" + theEvent.street + " " + theEvent.city + " " + theEvent.state + " " + theEvent.zip;
		var markers = [
			{'location': address,
			'color': 'red',
			'shadow': false,
			'icon': "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600"
			 }
		];
		var styles = [
    	{ 'feature': 'road', 'element': 'all', 'rules': 
      	  { 'hue': '0x00ff00' }
    	}
		];
		var mapStr = gm.staticMap(address, 15, '500x400', false, false, 'roadmap', markers, styles);
		var drivers = [];
		rides.for_event(team._id, eventName, function(rides_for_event) {
			async.forEach(rides_for_event, function(item, callback) {
				users.find_by_id(item.driverID, function(doc) {
					drivers.push(doc);
					callback();
				});
			}, function(err){
				res.render('eventShow', {team: team, theEvent: theEvent, map: mapStr, rides: rides_for_event, drivers: drivers, 'current_user': theUser, 'warning': warningMessage, 'success': successMessage});
			});
		});
	});
}