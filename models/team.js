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
var async = require('async');
/********************************************************/
//nodejitsu pls work
/********************************************************/
var mongodb = require('mongodb');
var db = new mongodb.Db('nodejitsu_egan_nodejitsudb900283013',
 new mongodb.Server('ds045998.mongolab.com', 45998, {})
);
db.open(function (err, db_p) {
 if (err) { throw err; }
 db.authenticate('nodejitsu_egan', '9vf6n4o08kpim8r32oqq90mbli', function (err, replies) {
   // You are now connected and authenticated.
 });
});
/********************************************************/
// pls
/********************************************************/

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
	db.collection(collection).insert({"name": name, "sport": sport, "coach": coach, "events": [], "active": active}, {safe:true}, function(err, crsr) {
		callback(crsr[0]);
	});
}

 /*
  * List all teams
  */
exports.list = function(callback) {
	var crsr = db.collection(collection).find();
	crsr.toArray(function(err, docs) {
		callback(docs);
	});
}

/*
 * Find a team
 */
exports.find = function(name, callback) {
	var crsr = db.collection(collection).find({name: name});
	crsr.toArray(function(err, docs){
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}

/*
 * gets a team by its ID
 */
exports.find_by_id = function(teamID, callback) {
	var crsr = db.collection(collection).find({"_id": mongodb.ObjectID(teamID)});
	crsr.toArray(function(err, docs){
		if(err) {
			doError(err);
		}
		callback(docs[0]);
	});
}

/*
 * A hack-y last minute fix
 */
exports.find_by_id_hack_fix = function(teamID, callback) {
	var crsr = db.collection(collection).find({'_id': teamID});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		callback(docs[0]);
	});
}

/*
 * shows a team
 */
exports.show = function(name, callback) {
	var  crsr = db.collection(collection).find({name: name});
	crsr.toArray(function(err, docs){
		callback(docs[0]);
	});
}

/*
 * Update a team
 */
exports.update = function(name, sport, coach, active, callback) {
	db.collection(collection).update({"name": name}, {'$set': {'name': name, 'coach':coach, 'sport':sport, 'active':active}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/* 
 * Deletes a team
 */
exports.destroy = function(name, callback) {
	db.collection(collection).findAndRemove({"name": name}, ["name", "ascending"], function(err, doc) {
		if(err) {
			doError(err);
		}
		callback("Successfully Removed");
	});	
}

/*
 * Deactivates a team
 */
exports.deactivate = function(name) {
	db.collection(collection).update({"name": name}, {'$set': {'active':false}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/*
 * Add an event to a team
 */
exports.addEvent = function(name, street, city, state, zip, team_name, datetime, callback) {
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
			callback(docs);
		});
	});
}

/*
 * checks to see if an event does not already exist for the team
 */
exports.unique_event = function(team_name, event_name, callback) {
	var crsr = db.collection(collection).find({'name': team_name});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		var theTeam = docs[0];
		var events  = theTeam.events;
		async.forEach(events, function(item, innerCallback) {
			if(item.name == event_name) {
				return callback(false);
			}
			innerCallback();
		}, function(err){
			if(err) {
				doError(err);
			}
			return callback(true);
		});
	});
}
/*
 * Deactivates a team
 */
exports.activate = function(name) {
	db.collection(collection).update({"name": name}, {'$set': {'active':true}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/*
 * gets an event to show
 */
exports.showEvent = function(teamName, eventName, callback) {
	var teams = db.collection(collection).find({"name": teamName});
	teams.toArray(function(err, docs) {
		var events = docs[0].events;
		var found = false;
		for(var i = 0; i < events.length; i++) {
			if(events[i]["name"] === eventName) {
				found = true;
				callback(docs[0], events[i]);
			}
		}
		if(!found) {
			callback("Event not found");
		}
	});
}