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
exports.find = function(username, callback) {
	console.log("username is " + JSON.stringify(username));
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find(username);
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
exports.update = function(query, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update(JSON.parse(query.find), JSON.parse(query.update), {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback('Update succeeded');
		});
	});
}