$(document).ready(function(){
	$("#f1").submit(newUserSubmit);
});

function newUserSubmit() {
	alert("Trying to create a user named " + $("#username").val() + " with the password " + $("#password").val());
}