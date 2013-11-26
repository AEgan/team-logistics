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
	res.render('signup');
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
		res.render('userPage', {title:"Password fields did not match", obj:""});
	}
	var active = true;
	if(req.body.active == "on") {
		active = true;
	}
	else {
		active = false;
	}
	users.insert(username, password, active, street, city, state, zip, role, function(model) {
		res.render('userPage', {title:"Inserted the following object", obj:model});
	});
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

exports.show = function(req, res) {
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
				res.render('userPage', {title: "title test", header: "hi", obj: model, map: mapStr, teams: returnedTeams});
			});
		});
	});
}

exports.auth = function(req, res) {
	users.auth(req.body.username, req.body.password, function(docs) {
		if(docs[0]) {
			req.session.user = docs[0];
			res.render('index', {title: "Logged In", current_user: req.session.user });
		}
		else {
			res.render('login');
		}
	});
}