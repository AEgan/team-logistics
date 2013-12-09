/*
 * A team member associated entity that stores the team's ID, the user's ID, the start date, and the end date
 */
var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "teamMembers";
var database = "logistics";
var users = require("./user.js");
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
 * Insert a new team member
 */
exports.insert = function(teamID, userID, startDate, callback) {
	db.collection(collection).insert({"teamID": teamID, "userID": userID, "startDate": startDate, "endDate": null}, {safe:true}, function(err, crsr) {
		callback(crsr);
	});
}

/*
 * get all of the team members for a given user
 */
exports.for_user = function(userID, callback) {
	var crsr = db.collection(collection).find({"userID": "" + userID});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}

exports.user_on_team = function(userID, teamID, callback) {
	var crsr = db.collection(collection).find({"userID": "" + userID, "teamID": "" + teamID});
	crsr.toArray(function(err, docs){
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}

/*
 * get all of the team members for a given team
 */
exports.for_team = function(teamID, callback) {
	var crsr = db.collection(collection).find({"teamID": "" + teamID});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}