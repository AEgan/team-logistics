/*
 * This is a model for a ride. A ride is a ride to an event.
 * The way the other things in this application are structured will make this interesting, so here is the deal.
 * Because I decided to try using arrays with js objects to store events in mongodb, I will be using three "foreign keys"
 * for a ride (also having a creater ID). It will be associated with a team and an event name, because events don't have an 
 * ID. If I change this I'll do it later, but I need to get something done quickly so that's just how it's going to work.
 * It'll have an event name, a team ID, a driver ID, a time of departure, and a list of riders. 
 */

var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "rides";
var database = "logistics";
var mongodb = require("mongodb");
var async = require("async");

var doError = function(e) {
	util.debug("ERROR: " + error);
	throw new Error(error);
}

/*
 * Inserts a new ride
 */
exports.insert = function(teamID, eventName, driverID, departureTime, spots, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		db.collection(collection).insert({"eventName": eventName, "teamID": teamID, "driverID": driverID, "departureTime": departureTime, "spots": spots, "riders": []}, {safe: true}, function(err, crsr) {
			callback(crsr);
		});
	});
}

/*
 * Gets rides associated with an event and a team's ID
 */
exports.for_event = function(teamID, eventName, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find({"teamID": teamID, "eventName": eventName});
		crsr.toArray(function(err, docs){
			if(err) {
				doError(err);
			}
			callback(docs);
		});
	});
}

/*
 * adds a rider to a ride
 */
exports.add_rider_to_ride = function(rideID, riderID, callback) {
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find({"_id": mongodb.ObjectID(rideID)});
		crsr.toArray(function(err, docs) {
			if(err) {
				doError(err);
			}
			var theRide = docs[0];
			if(theRide.riders.length != theRide.spots) {
				db.collection(collection).update({"_id": mongodb.ObjectID(rideID)}, {'$push': {'riders': {'riderID': riderID}}}, {'new': true}, function(err, docs) {
					if(err) {
						doError(err);
					}
					callback(docs);
				});
			}
		});
	});
}

/*
 * removes a rider from a ride
 */
 exports.remove_rider_from_ride = function(rideID, riderID, callback) {
 	mongoClient.connect(server+database, function(err, db) {
 		if(err) {
 			doError(err);
 		}
 		db.collection(collection).update({"_id": mongodb.ObjectID(rideID)}, {'$pull': {'riders': {'riderID': riderID}}}, {safe: true}, function(err, docs) {
 			if(err) {
 				doError(err);
 			}
 			callback(docs);
 		});
 	});
 }

 /*
  * Determines if a rider can join the ride
  */
  exports.rider_can_join = function(rideID, riderID, callback) {
  	mongoClient.connect(server+database, function(err, db) {
  		if(err) {
  			doError(err);
  		}
  		var theRideCrsr = db.collection(collection).find({'_id': mongodb.ObjectID(rideID)});
  		theRideCrsr.toArray(function(err, docs) {
  			if(err) {
  				doError(err);
  			}
  			var ride = docs[0];
  			var teamID = ride.teamID;
  			var eventName = ride.eventName;
  			var result = {};
  			var ridesCrsr = db.collection(collection).find({"teamID": teamID, "eventName": eventName});
  			ridesCrsr.toArray(function(err, docs) {
  				if(err) {
  					doError(err);
  				}
  				async.forEach(docs, function(item, innerCallback) {
  					if(item.driverID == riderID) {
  						result.joined = false;
  						result.message = "You have already driving to this event";
  						return callback(result);
  					}
  					else {
  						for(var i = 0; i < item.riders.length; i++) {
  							if(item.riders[i].riderID == riderID) {
  								result.joined = false;
  								result.message = "You have already joined a ride for this event";
  								return callback(result);
  							}
  						}
  					}//what
  					innerCallback();
  				}, function(err) {
  					if(err) {
  						doError(err);
  					}
  					result.joined = true;
  					result.message = "You have successfully joined this ride";
  					callback(result);
  				});
  			});
  		});
  	});
  }