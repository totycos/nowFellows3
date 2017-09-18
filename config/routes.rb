Rails.application.routes.draw do
  get 'quiz/show'

  get 'quiz/validate'

  devise_for :users, :controllers => { :omniauth_callbacks => "user/omniauth_callbacks" }

  #root 'home#connexion'
  root 'home#index'
  get 'connexion' => 'home#connexion'
  get 'profil' => 'users#profil'
  get 'chat' => 'users#chat'

  resources :conversations, only: [:create] do
    member do
      post :close
    end
    resources :messages, only: [:create]
  end
  #devise_scope :user do
  #  root to: "devise/sessions#new"
  #end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
