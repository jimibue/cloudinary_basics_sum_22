Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  get '/data', to:'tacos#get_data'
  post '/yo', to:'tacos#new_user' 
  post '/yo/:mustard', to:'tacos#new_photo' 
end
