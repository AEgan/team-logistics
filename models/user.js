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
exports.insert = function(username, password, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).insert({"username": username, "password": password}, {safe:true}, function(err, crsr) {
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
 * Update a user
 */
exports.update = function(username, newPassword, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"username": username}, {'$set': {'password': newPassword}}, {new:true}, function(err, crsr) {
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