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
						console.log("model is " + JSON.stringify(model));
						console.log("model id is " + model._id);
						teams.find_by_id_hack_fix(model._id, function(fix) {
							team_members.insert(fix._id.toHexString(), req.session.user._id, Date(), function(member) {
								res.render('teamPage', {team: model, warning: undefined, success: "Team successfully created", members: [req.session.user], 'current_user': req.session.user});
							});
						});
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
	var theUser = undefined;
	if(req.session.user) {
		theUser = req.session.user;
	}
	else {
		req.session.warning = "You must be logged in to do this";
		return res.redirect('/login');
	}
	var name = req.body.name;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var teamName = req.params.name;
	var datetime = req.body.datetime;

	var warningMessage = undefined;
	if(!name || name == '') {
		if(!warningMessage) {
			warningMessage = "You must enter a name for this event";
		}
		else {
			warningMessage += ", you must enter a name for this event";
		}
	}
	if(!street || street == '') {
		if(!warningMessage) {
			warningMessage = "You must enter a street for this event";
		}
		else {
			warningMessage += ", you must enter a street for this event";
		}
	}
	if(!city || city == '') {
		if(!warningMessage) {
			warningMessage = "You must enter a city for this event";
		}
		else {
			warningMessage += ", you must enter a city for this event";
		}
	}
	var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
	if(!state || state == '' || states.indexOf(state) == -1) {
		if(!warningMessage) {
			warningMessage = "You must enter a state for this event";
		}
		else {
			warningMessage += ", you must enter a state for this event";
		}
	}
	if(!datetime || datetime == '') {
		if(!warningMessage) {
			warningMessage = "You must enter a date and time for this event";
		}
		else {
			warningMessage += ", you must enter a date and time for this event";
		}
	}
	if(warningMessage) {
		req.session.warning = warningMessage;
		return res.redirect('teams/'+teamName+'/newEvent')
	}
	else {
		teams.unique_event(teamName, name, function(result) {
			if(result) {
				teams.addEvent(name, street, city, state, zip, teamName, datetime, function(response) {
					req.session.success = "Successfully added event " + name;
					return res.redirect('/teams/' + teamName  + '/' + name);
				});
			}
			else {
				req.session.warning = "An event with this name already exists";
				return res.redirect('/teams/'+teamName+'/newEvent');
			}
		});
	}
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