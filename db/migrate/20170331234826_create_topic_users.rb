class CreateTopicUsers < ActiveRecord::Migration
  def change
    create_table :topic_users do |t|
      t.integer :topic_id
      t.integer :user_id
      t.integer :vote_status

      t.timestamps null: false
    end
  end
end
