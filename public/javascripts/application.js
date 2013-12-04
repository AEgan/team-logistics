$(document).ready(function(){
	var joinRideButtons = $('.joinRideButton');
	$.each(joinRideButtons, function(index, value) {
		$(value).click(function(){
			var aj = $.ajax({
				url: '/addRideMember',
				type: 'put',
				data: {
					rideID: $(value).attr('data')
				}
			});
			aj.done(function(data) {
				console.log(data);
			});
		});
	});
});