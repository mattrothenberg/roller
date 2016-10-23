require 'open-uri'
require 'cgi'

class Video < Struct.new(:url, :length); end

def get_video_attributes(id)
  CGI.parse open("http://youtube.com/get_video_info?video_id=#{id}").read
end

def get_mp4_stream(video_attributes)
  streams = video_attributes['url_encoded_fmt_stream_map'].first.split(',')
  streams.map do |cgi_payload|
    CGI.parse cgi_payload
  end.detect do |stream|
    stream['type'].first.split('; ').first == 'video/mp4'
  end
end

def get_video_length(video_attributes)
  video_attributes['length_seconds'].first.to_i
end

def get_mp4_video_info(video_id)
  video_attributes = get_video_attributes(video_id)
  stream = get_mp4_stream(video_attributes)
  video_length = get_video_length(video_attributes)
  Video.new(stream['url'].first, video_length)
end

def store_at(url, path)
  open(url) do |video_file|
    File.open(path, 'wb') do |file|
      file.puts video_file.read
    end
  end
end

