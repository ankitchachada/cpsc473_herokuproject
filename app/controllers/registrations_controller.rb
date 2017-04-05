class RegistrationsController < Devise::RegistrationsController 
	before_filter :configure_permitted_parameters 
    respond_to :json

    def configure_permitted_parameters
    	devise_parameter_sanitizer.for(:sign_up) do |u|
      		u.permit(:firstname, :lastname, :email, :password, :password_confirmation)
    	end
  	end
end  