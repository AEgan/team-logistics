/*
 * Team model which will have a team name, sport, coach name, and active.
 * It also has a collection of events which have a name, 
 * sport could be its own model, but for scope reasons it is not
 * Coach could be a user ID but for scope reasons, and for now, it is just going to be a name
 * Examples of name:
 * Name: "Flyers"
 * Name: "St Joes Prep Hawks"
 */

var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "teams";
var database = "logistics";

/*
 * Simple Error Handling function
 */
var doError = function(error) {
	util.debug("ERROR: " + error);
	throw new Error(error);
}

/*
 * Insert a new team
 */
exports.insert = function(name, sport, coach, active, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).insert({"name": name, "sport": sport, "coach": coach, "events": [], "active": active}, {safe:true}, function(err, crsr) {
			callback(crsr[0]);
		});
	});
}

 /*
  * List all teams
  */
exports.list = function(callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find();
		crsr.toArray(function(err, docs) {
			callback(docs);
		});
	});
}

/*
 * Find a team
 */
exports.find = function(name, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find({name: name});
		crsr.toArray(function(err, docs){
			if(err) {
				doError(err);
			}
			callback(docs);
		});
	});
}

/*
 * shows a team
 */
exports.show = function(name, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var  crsr = db.collection(collection).find({name: name});
		crsr.toArray(function(err, docs){
			callback(docs[0]);
		});
	});
}

/*
 * Update a team
 */
exports.update = function(name, sport, coach, active, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"name": name}, {'$set': {'name': name, 'coach':coach, 'sport':sport, 'active':active}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}

/* 
 * Deletes a team
 */
exports.destroy = function(name, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).findAndRemove({"name": name}, ["name", "ascending"], function(err, doc) {
			if(err) {
				doError(err);
			}
			callback("Successfully Removed");
		});	
	});
}

/*
 * Deactivates a team
 */
exports.deactivate = function(name) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"name": name}, {'$set': {'active':false}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}

/*
 * Add an event to a team
 */
exports.addEvent = function(name, street, city, state, zip, longitude, latitude, team_name, datetime, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({name: team_name}, {'$push': {"events": {'name': name, 'street': street, 'city':city, 'state': state, 'zip':zip, 'longitude': longitude, 'latitude':latitude, 'date': new Date(datetime)}}}, {new:true}, function(err, docs) {
			if(err) {
				doError(err);
			}
			callback("Event added");
		});
	});
}

/*
 * Deactivates a team
 */
exports.activate = function(name) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).update({"name": name}, {'$set': {'active':true}}, {new:true}, function(err, crsr) {
			if(err) {
				doError(err);
			}
			callback("Update Worked");
		});
	});
}