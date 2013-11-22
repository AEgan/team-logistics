var users = require('../models/user.js');
var util = require('util');
var gm = require('googlemaps');
/*
 * Insert a new user
 */
exports.insert = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password_confirmation = req.body.passwordconfirmation;
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
	users.insert(username, password, active, function(model) {
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
		res.render('userPage', {title: "title test", header: "hi", obj: model, map: mapStr});
	});
}