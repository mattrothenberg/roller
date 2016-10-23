require_relative '../convert_video_use_case.rb'
require 'open-uri'

describe 'Converting a video' do

  it 'pulls from youtube and converts the video' do

    gif_url = convert_video_use_case('CMNry4PE93Y', 7, 10)

    expect(gif_url).to include('http')

    open(gif_url) do |gif|
      expect(gif.size).to be > 0
    end

  end

  it 'throws an exception when the interval is too long' do
    expect{convert_video_use_case('CMNry4PE93Y', 0, 16)}.to raise_error GifTooLong
  end

  it 'throws an exception when the video is too long' do
    expect{
      long_video = 'cB57yJ0ZYAs'
      convert_video_use_case(long_video, 0, 5)
    }.to raise_error VideoTooLong
  end

end