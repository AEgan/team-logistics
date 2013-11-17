var users = require('../models/user.js');

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
		var mapString = "http://maps.googleapis.com/maps/api/staticmap?center="+model.latitude+","+model.longitude+"&zoom=12&size=400x400&sensor=false";
		res.render('userPage', {title: "title test", header: "hi", obj: model, map: mapString});
	});
}