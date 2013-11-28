exports.index = function(req, res) {
	var theUser = undefined;
	if(req.session && req.session.user) {
		theUser = req.session.user;
	}
	var successMessage = undefined;
	var warningMessage = undefined;
	res.render('index', {title:'Welcome', current_user: theUser, success: successMessage, warning: warningMessage});
}

exports.login = function(req, res) {
	res.render('login', {warning: undefined});
}