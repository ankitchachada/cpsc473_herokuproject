class TopicsController < ApplicationController
  before_action :set_topic, only: [:show, :edit, :update, :destroy]
  before_action :set_user

  # GET /topics
  # GET /topics.json
  def index
    @topics = Topic.all
    
    respond_to do |format|
      format.json { render json: @topics.to_json(:include => :topic_users)}
    end
  end

  # GET /topics/1
  # GET /topics/1.json
  def show
  end

  # GET /topics/new
  def new
    @topic = Topic.new
  end

  # GET /topics/1/edit
  def edit
  end

  # POST /topics
  # POST /topics.json
  def create
    @topic = Topic.new(topic_params)
    @topic.user_id = current_user.id
    @topic.email = current_user.email
    respond_to do |format|
      if @topic.save
        format.html { redirect_to root_url, notice: 'Topic was successfully created.' }
        format.json { render :show, status: :created, location: @topic }
      else
        format.html { render :new }
        format.json { render json: @topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /topics/1
  # PATCH/PUT /topics/1.json
  def update
    @tu = TopicUser.find_by_user_id_and_topic_id(current_user.id,params[:id])
    if @tu.nil?
      @tu = @topic.topic_users.create
      @tu.user_id = current_user.id
    end
    @tu.vote_status = params[:voteStatus]
    @tu.votes = params[:votes].to_i 
    @tu.save
    
    respond_to do |format|
      if @topic.save
        #format.html { redirect_to @topic, notice: 'Topic was successfully updated.' }
        format.json { render json: @topic.to_json}
      else
        format.html { render :edit }
        format.json { render json: @topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /topics/1
  # DELETE /topics/1.json
  def destroy
    @topic.destroy
    respond_to do |format|
      #format.html { redirect_to topics_url, notice: 'Topic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def votes
  	
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_topic
      @topic = Topic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def topic_params
      params.require(:topic).permit(:title, :user_id, :votes)
    end

    def set_user
      cookies[:username] = current_user.try(:id) || 'guest'
    end
end
