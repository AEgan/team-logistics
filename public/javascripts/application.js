$(document).ready(function(){
	$('.success').hide();
	$('.warning').hide();
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
					$('.success').append("<p>" + data.message + "</p>");
					$('.success').show();
				}
				else {
					$('.warning').append("<p>" + data.message + "</p>");
					$('.warning').show();
				}
			});
		});
	});
});