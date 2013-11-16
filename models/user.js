/*
 * The user model. Users will have a username, password (will be secured later)
 * active field, street, city, state, and zip (for location purposes)
 * as well as a role (for admin/member)
 */

var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "users";
var database = "logistics";

/*
 * Simple Error Handling function
 */
var doError = function(error) {
	util.debug("ERROR: " + error);
	throw new Error(error);
}

/*
 * Insert a new user
 */
exports.insert = function(username, password, active, street, city, state, zip, role, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).insert({"username": username, "password": password, "active": active, "street": street, "city": city, "state": state, "zip": zip, "role": role}, {safe:true}, function(err, crsr) {
			callback(crsr);
		});
	});
}

/*
 * Find a user
 */
exports.find = function(query, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find(query);
		crsr.toArray(function(err, docs){
			if(err) {
				doError(err);
			}
			callback(docs);
		});
	});
}

/*
 * Update a user. Note lack of role, users won't be able to update their own role
 */
exports.update = function(username, newPassword, active, street, city, state, zip, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"username": username}, {'$set': {'password': newPassword, 'active':active, "street": street, "city": city, "state": state, "zip": zip, "role": role}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}

/* 
 * Deletes a user
 */
exports.destroy = function(username, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).findAndRemove({"username": username}, ["username", "ascending"], function(err, doc) {
			if(err) {
				doError(err);
			}
			callback("Successfully Removed");
		});	
	});
}

/*
 * Deactivates a user
 */
exports.deactivate = function(username) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"username": username}, {'$set': {'active':false}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}

/*
 * Deactivates a user
 */
exports.activate = function(username) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"username": username}, {'$set': {'active':true}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}