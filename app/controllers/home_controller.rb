class HomeController < ApplicationController

  def connexion
    if user_signed_in?
       redirect_to profil_path
     else
       redirect_to new_user_registration_path
    end
  end

  def index
    session[:conversations] ||= []

    @users = User.all.where.not(id: current_user)
    @conversations = Conversation.includes(:recipient, :messages)
                                 .find(session[:conversations])
  end

end
