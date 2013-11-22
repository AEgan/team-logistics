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
var gm = require('googlemaps');

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
exports.addEvent = function(name, street, city, state, zip, team_name, datetime, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		gm.geocode("" + street + " " + city + " " + state + " " + zip, function(err, result) {
			if(err) {
				doError(err);
			}
			var lng = result.results[0].geometry.bounds.northeast.lng;
			var lat = result.results[0].geometry.bounds.northeast.lat;
			db.collection(collection).update({name: team_name}, {'$push': {"events": {'name': name, 'street': street, 'city':city, 'state': state, 'zip':zip, 'longitude': lng, 'latitude':lat, 'date': new Date(datetime)}}}, {new:true}, function(err, docs) {
				if(err) {
					doError(err);
				}
				callback("Event added");
			});
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

/*
 * gets an event to show
 */
exports.showEvent = function(teamName, eventName, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var teams = db.collection(collection).find({"name": teamName});
		teams.toArray(function(err, docs) {
			var events = docs[0].events;
			var found = false;
			for(var i = 0; i < events.length; i++) {
				if(events[i]["name"] === eventName) {
					found = true;
					callback(events[i]);
				}
			}
			if(!found) {
				callback("Event not found");
			}
		});
	});
}