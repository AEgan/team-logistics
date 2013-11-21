/*
 * A team member associated entity that stores the team's ID, the user's ID, the start date, and the end date
 */
var util = require("util");
var mongoClient = require("mongodb").MongoClient;
var server = "mongodb://localhost:27017/";
var collection = "teamMembers";
var database = "logistics";
var mongodb = require("mongodb");
var users = require("./user.js");
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
	console.log("the team ID is " + teamID);
	mongoClient.connect(server+database, function(err, db) {
		if(err) {
			doError(err);
		}
		var crsr = db.collection(collection).find({"teamID": "" + teamID});
		crsr.toArray(function(err, docs) {
			if(err) {
				doError(err);
			}
			console.log("docs are " + docs + " in the for_team function");
			callback(docs);
		});
	});
}

// exports.for_team = function(teamID, callback) {
// 	mongoClient.connect(server+database, function(err, db) {
// 		var crsr = db.collection(collection).find({"teamID": teamID});
// 		crsr.toArray(function(err, docs) {
// 			if(err) {
// 				doError(err);
// 			}
// 			try {
// 				var returnedUsers = [];
// 				console.log("docs length is " + docs.length)
// 				for(var i = 0; i < docs.length; i++) {
// 					users.find_by_id(docs[i].userID, function(model) {
// 						returnedUsers[i] = model;
// 						console.log("on line 62");
// 						console.log("i is " + i + " returned users length is " + returnedUsers.length);
// 					});
// 				}
// 				if(returnedUsers.length == docs.length) {
// 					throw new Exception("lol");
// 				}
// 			} catch(e) {
// 				console.log("caught the exception");
// 				console.log("68");
// 				callback(returnedUsers);
// 			}
// 		});
// 	});
// }