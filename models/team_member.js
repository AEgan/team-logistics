/*
 * A team member associated entity that stores the team's ID, the user's ID, the start date, and the end date
 */
var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "teamMembers";
var database = "logistics";
var mongodb = require("mongodb");
/*
 * Simple Error Handling function
 */
var doError = function(error) {
	util.debug("ERROR: " + error);
	throw new Error(error);
}

/*
 * Insert a new team member
 */
exports.insert = function(teamID, userID, startDate, callback) {
	mongoClient.connect(server+database, function(err, db) { 
		if(err) {
			doError(err);
		}
		db.collection(collection).insert({"teamID": teamID, "userID": userID, "startDate": startDate, "endDate": null}, {safe:true}, function(err, crsr) {
			callback(crsr);
		});
	});
}

/*
 * get all of the team members for a given user
 */
exports.for_user = function(userID, callback) {
	mongoClient.connect(server+database, function(err, db) {
		var crsr = db.collection(collection).find({"userID": new mongodb.ObjectID.createFromHexString(userID)});
		crsr.toArray(function(err, docs) {
			if(err) {
				doError(err);
			}
			callback(docs);
		})
	});
}

/*
 * get all of the team members for a given team
 */
exports.for_team = function(teamID, callback) {
	mongoClient.connect(server+database, function(err, db) {
		console.log(teamID);
		var crsr = db.collection(collection).find({"teamID": new mongodb.ObjectID.createFromHexString("" + teamID)});
		crsr.toArray(function(err, docs) {
			if(err) {
				doError(err);
			}
			callback(docs);
		})
	});
}