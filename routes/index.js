exports.index = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	res.render('index', {title:'Welcome', current_user: theUser});
}

exports.login = function(req, res) {
	res.render('login');
}