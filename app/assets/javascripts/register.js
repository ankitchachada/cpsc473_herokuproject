$(document).on('click', '#signup-form .btn-default', function() {
    var email = $('#emailInput').val();
    var password = $('#password').val();
    var fname = $('#firstName').val();
    var lname = $('#lastName').val();
    var passwordc = $('#confirm_password').val();
    $.ajax({
        type: "POST",
        url: 'users', //sumbits it to the given url of the form
        data: {user: {email: email, password: password, password_confirmation: passwordc,firstname: fname, lastname: lname }}, 
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