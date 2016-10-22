require 'sinatra'
require_relative './convert_video_use_case.rb'

set :public_folder, './frontend/build'

get '/' do
  File.open('./frontend/build/index.html') do |file|
    file.read
  end
end

post '/convert' do
  { gif_url: convert_video_use_case(params[:video_id]) }
end

get '/stub' do
  "Your URL is #{params[:url]} starting from #{params[:start]} to #{params[:end]}"
end
