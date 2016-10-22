require 'open-uri'
require 'cgi'

def get_video_attributes(id)
  CGI.parse open("http://youtube.com/get_video_info?video_id=#{id}").read
end

def get_mp4_stream(id)
  streams = get_video_attributes(id)['url_encoded_fmt_stream_map'].first.split(',')
  streams.map do |cgi_payload|
    CGI.parse cgi_payload
  end.detect do |stream|
    stream['type'].first.split('; ').first == 'video/mp4'
  end
end

def get_mp4_video_url(video_id)
  stream = get_mp4_stream(video_id)
  stream['url'].first
end

def store_at(url, path)
  open(url) do |video_file|
    File.open(path, 'wb') do |file|
      file.puts video_file.read
    end
  end
end

