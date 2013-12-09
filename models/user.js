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
var gm = require('googlemaps');
var bcrypt = require('bcrypt');
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
 * Insert a new user
 */
exports.insert = function(username, password, active, street, city, state, zip, role, callback) {
	gm.geocode(street + " " + city + " " + state + " " + zip, function(err, result) {
		var lng = result.results[0].geometry.bounds.northeast.lng;
		var lat = result.results[0].geometry.bounds.northeast.lat;
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);
		db.collection(collection).insert({"username": username, "password": hash, "active": active, "street": street, "city": city, "state": state, "zip": zip, "role": role, "latitude": lat, "longitude": lng}, {safe:true}, function(err, crsr) {
			callback(crsr);
		});
	});
}

/*
 * Find a user
 */
exports.find = function(query, callback) {
	var crsr = db.collection(collection).find(query);
	crsr.toArray(function(err, docs){
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}

/*
 * gets a user by a name
 */
 exports.find_by_username = function(username, callback) {
	var crsr = db.collection(collection).find({'username': username});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		callback(docs);
	});
 }

/*
 * gets a user by its ID
 */
exports.find_by_id = function(id, callback) {
	var crsr = db.collection(collection).find({"_id": mongodb.ObjectID(id)});
	crsr.toArray(function(err, docs) {
		callback(docs[0]);
	});
}

/*
 * shows a user
 */
exports.show = function(username, callback) {
	var  crsr = db.collection(collection).find({username: username});
	crsr.toArray(function(err, docs){
		callback(docs[0]);
	});
}

/*
 * Update a user. Note lack of role, users won't be able to update their own role
 */
exports.update = function(username, newPassword, active, street, city, state, zip, callback) {
	db.collection(collection).update({"username": username}, {'$set': {'password': newPassword, 'active':active, "street": street, "city": city, "state": state, "zip": zip, "role": role}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/* 
 * Deletes a user
 */
exports.destroy = function(username, callback) {
	db.collection(collection).findAndRemove({"username": username}, ["username", "ascending"], function(err, doc) {
		if(err) {
			doError(err);
		}
		callback("Successfully Removed");
	});
}

/*
 * Deactivates a user
 */
exports.deactivate = function(username) {
	db.collection(collection).update({"username": username}, {'$set': {'active':false}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/*
 * Deactivates a user
 */
exports.activate = function(username) {
	db.collection(collection).update({"username": username}, {'$set': {'active':true}}, {new:true}, function(err, crsr) {
		if(err) {
			doError(err);
		}
		callback("Update Worked");
	});
}

/*
 * authentication for users
 */
exports.auth = function(username, password, callback) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	var crsr = db.collection(collection).find({"username": username});
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		if(docs.length == 0) {
			return callback([]);
		}
		if(bcrypt.compareSync(password, docs[0].password)) {
			return callback(docs);
		}
		else {
			return callback([]);
		}
	});
}

/*
 * Gets all of the users
 */
exports.all = function(callback) {
	var crsr = db.collection(collection).find();
	crsr.toArray(function(err, docs) {
		if(err) {
			doError(err);
		}
		callback(docs);
	});
}