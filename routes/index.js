exports.index = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	var successMessage = undefined;
	var warningMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
		delete req.session.warning;
	}
	res.render('index', {title:'Welcome', current_user: theUser, success: successMessage, warning: warningMessage});
}

exports.login = function(req, res) {
	var warningMessage = undefined;
	if(req.session && req.session.warning) {
		warningMessage = req.session.warning;
	}
	delete req.session.warning;
	res.render('login', {warning: warningMessage});
}