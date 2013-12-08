$(document).ready(function(){
	$('.rideSuccess').hide();
	$('.rideWarning').hide();
	var joinRideButtons = $('.joinRideButton');
	$.each(joinRideButtons, function(index, value) {
		$(value).click(function(){
			var aj = $.ajax({
				url: '/addRideMember',
				type: 'put',
				data: {
					rideID: $(value).attr('data'),
					teamID: $(value).attr('team')
				}
			});
			aj.done(function(data) {
				if(data.pass) {
					$('.rideSuccess').append("<p>" + data.message + "</p>");
					$('.rideSuccess').show();
				}
				else {
					$('.rideWarning').append("<p>" + data.message + "</p>");
					$('.rideWarning').show();
				}
			});
		});
	});
});