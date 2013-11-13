var users = require('../models/user.js');

/*
 * Insert a new user
 */
exports.insert = function(req, res) {
	console.log('in insert');
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
	console.log('in update');
	users.update(req.query, function(model) {
		res.render('userPage', {title:'worked', obj:model});
	});
}