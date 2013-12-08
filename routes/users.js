var users = require('../models/user.js');
var util = require('util');
var gm = require('googlemaps');
var team_members = require('../models/team_member.js');
var teams = require('../models/team.js');
var async = require("async");

/*
 * The page to sign a new user up
 */

exports.create = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	if(theUser) {
		req.session.warning = "You are currently logged in and can not create a user";
		res.redirect('/');
	}
	res.render('signup', {warning: undefined});
}

/*
 * Insert a new user
 */
exports.insert = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password_confirmation = req.body.passwordconfirmation;
	var street = req.body.street;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var role = req.body.role;
	if(password !== password_confirmation) {
		return res.render('signup', {warning:"Password fields did not match"});
	}
	else {
		var active = true;
		if(req.body.active == "on") {
			active = true;
		}
		else {
			active = false;
		}
		users.insert(username, password, active, street, city, state, zip, role, function(model) {
			req.session.user = model[0];
			res.render('userPage', {title:"Welcome to the website!", obj:model, current_user: req.session.user, warning: undefined, success: "Welcome to the site!"});
		});
	}
}

/*
 * Find a user
 */
exports.find = function(req, res) {
	users.find(req.query, function(model) {
		res.render('userPage', {title:"worked", obj:model});
	});
}

/*
 * Update a user
 */
exports.update = function(req, res) {
	var active = true;
	if(req.body.active == "on") {
		active = true;
	}
	else {
		active = false;
	}
	users.update(req.body.username, req.body.password, active, function(model) {
		res.render('userPage', {title:'worked', obj:model});
	});
}

/*
 * Destroys a user
 */
exports.destroy = function(req, res) {
	users.destroy(req.body.username, function(model) {
		res.render('userPage', {title: 'worked', obj:model});
	});
}

/*
 * Profile page logic
 */
exports.show = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	var returnedTeams = [];
	users.show(req.params.username, function(model) {
		var address = "" + model.street + " " + model.city + " " + model.state;
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
		team_members.for_user(model._id, function(docs) {
			async.forEach(docs, function(item, callback){
				teams.find_by_id(item.teamID, function(found){
					returnedTeams.push(found);
					callback();
				})
			}, function(err){
				if(err) {
					doError(err);
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
				res.render('userPage', {title: "title test", header: "hi", obj: model, map: mapStr, teams: returnedTeams, 'current_user': theUser, 'warning': warningMessage, 'success': successMessage});
			});
		});
	});
}

/*
 * Authenticates a user
 */
exports.auth = function(req, res) {
	users.auth(req.body.username, req.body.password, function(docs) {
		if(docs[0]) {
			req.session.user = docs[0];
			res.render('index', {title: "Logged In", current_user: req.session.user, warning: undefined, success: "Logged In!" });
		}
		else {
			res.render('login', {warning: "Incorrect username or password"});
		}
	});
}

/*
 * Logs a user out
 */
exports.logout = function(req, res) {
	if(req.session && req.session.user) {
		delete req.session.user;
		res.render('index', {success: "Logged Out", current_user: undefined, warning: undefined});
	}
	else {
		res.render('index', {warning: "You were never logged in...", success: undefined, current_user: undefined})
	}
}

/*
 * Sends a logged in user to their profile, if no logged in user sends them to index
 */
exports.myProfile = function(req, res) {
	if(req.session && req.session.user) {
		var theUsername = req.session.user.username;
		res.redirect('/users/' + theUsername);
	}
	else {
		req.session.warning = "You must be logged in to do that";
		res.redirect('/');
	}
}