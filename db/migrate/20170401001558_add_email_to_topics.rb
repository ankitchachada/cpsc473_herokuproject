class AddEmailToTopics < ActiveRecord::Migration
  def change
    add_column :topics, :email, :string
  end
end
