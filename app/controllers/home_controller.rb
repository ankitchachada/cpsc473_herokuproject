class HomeController < ApplicationController
	before_action :set_user

	def dashboard
		
	end

	def sign_up
		
	end

	private 
	
	def set_user
      cookies[:username] = current_user.try(:id) || 'guest'
    end
end
