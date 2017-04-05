$(document).on('click', '#main-form .btn-default', function() {
	var email = $('#emailInput').val();
    var password = $('#password').val();
    $.ajax({
        type: "POST",
        url: 'users/sign_in', //sumbits it to the given url of the form
        data: {user: {email: email, password: password}}, 
        dataType: "JSON",
        success: function(data, textStatus) {
        	console.log(data);
       		window.location = 'dashboard'
    	},
    	error: function (request, status, error) {
        	alert(request.responseText);
    	}
    })
    return false; // prevents normal behaviour
});