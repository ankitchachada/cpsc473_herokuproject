class AddVotesToTopicUsers < ActiveRecord::Migration
  def change
    add_column :topic_users, :votes, :integer, default: 0
  end
end
