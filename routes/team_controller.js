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

/*
 * goes to a new event page
 */
exports.newEventPage = function(req, res) {
	var name = req.params.name;
	teams.find(name, function(model) {
		res.render('newEvent', {"team": model[0]});
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
	var longitude = req.body.longitude;
	var latitude = req.body.latitude;
	var teamName = req.body.teamName;
	var datetime = req.body.datetime;
	teams.addEvent(name, street, city, state, zip, longitude, latitude, teamName, datetime, function(response) {
		res.render('eventShow');
	});
}