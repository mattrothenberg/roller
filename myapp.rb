require 'sinatra'
require 'json'
require_relative './convert_video_use_case.rb'

set :public_folder, './frontend/build'

get '/' do
  File.open('./frontend/build/index.html') do |file|
    file.read
  end
end

post '/convert' do
  content_type :json
  { gif_url: convert_video_use_case(params[:video_id]) }.to_json
end

get '/stub' do
  "Your URL is #{params[:url]} starting from #{params[:start]} to #{params[:end]}"
end
