var express = require('express');
var helpers = require('express-helpers');
var routes = require('./routes');
var users = require('./routes/users');
var teams = require('./routes/team_controller');
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
app.post('/signup', users.insert);
app.get('/users/find', users.find);
app.post('/users/edit', users.update);
app.post('/users/destroy', users.destroy);
app.get('/users/:username', users.show);
app.get('/teams', teams.index);

app.listen(12345);
console.log("======================================");
console.log("Express server listening on port 12345");
console.log("======================================");