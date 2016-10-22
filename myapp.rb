require 'sinatra'

set :public_folder, './frontend/build'


get '/' do
  File.open('./frontend/build/index.html') do |file|
    file.read
  end
end

get '/stub' do
  "Your URL is #{params[:url]} starting from #{params[:start]} to #{params[:end]}"
end
