$(document).ready(function(){
	var joinRideButtons = $('.joinRideButton');
	$.each(joinRideButtons, function(index, value) {
		$(value).click(function(){
			alert("here");
		});
	});
});