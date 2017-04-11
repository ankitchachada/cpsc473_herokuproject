class Topic < ActiveRecord::Base
	belongs_to :user
	has_many :topic_users, dependent: :destroy
end
