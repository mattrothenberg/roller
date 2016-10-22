require_relative '../convert_video_use_case.rb'
require 'open-uri'

describe 'Converting a video' do

  it 'pulls from youtube and converts the video' do

    gif_url = convert_video_use_case('jmwWT0Jbdgs')

    expect(gif_url).to include('http')

    open(gif_url) do |gif|
      expect(gif.size).to be > 0
    end

  end

end