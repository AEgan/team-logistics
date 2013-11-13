var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
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
app.get('/users/:id', users.find);
app.post('/users/:id/edit', users.update);

app.listen(12345);
console.log("======================================");
console.log("Express server listening on port 12345");
console.log("======================================");