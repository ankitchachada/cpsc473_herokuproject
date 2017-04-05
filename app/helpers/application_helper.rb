module ApplicationHelper
	def get_data
	  arr = []
	  Topic.all.each do |i|
	  	arr << i.title
	  end
	  arr
	end
end
