json.extract! topic, :id, :title, :user_id, :votes, :created_at, :updated_at
json.url topic_url(topic, format: :json)
