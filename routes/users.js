var users = require('../models/user.js');

/*
 * Insert a new user
 */
exports.insert = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	users.insert(username, password, function(model) {
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
	users.update(req.body.username, req.body.password, function(model) {
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