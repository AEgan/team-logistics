var express = require('express');
var helpers = require('express-helpers');
var routes = require('./routes');
var users = require('./routes/users');
var teams = require('./routes/team_controller');
var team_members = require('./routes/team_member_controller');
var app = express();

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

app.get('/', routes.index);
app.get('/signup', users.create);
app.post('/insertUser', users.insert);
app.get('/users/find', users.find);
app.post('/users/edit', users.update);
app.post('/users/destroy', users.destroy);
app.get('/users/:username', users.show);
app.get('/teams', teams.index);
app.get('/teams/new', teams.newTeam);
app.post('/teams/insert', teams.insert);
app.get('/teams/:name', teams.show);
app.get('/teams/:name/newEvent', teams.newEventPage);
app.post('/teams/:name/newEvent', teams.postNewEvent);
app.get('/teams/:name/:event', teams.showEvent);
app.get('/newTeamMember', team_members.newMember);
app.post('/addnewmember', team_members.addMember);

app.listen(12345);
console.log("======================================");
console.log("Express server listening on port 12345");
console.log("======================================");