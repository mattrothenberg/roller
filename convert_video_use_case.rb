require_relative './youtube.rb'
require_relative './convert.rb'
require_relative './cloud_native_storage.rb'

def convert_video_use_case(video_id)
  video_path = "/tmp/video-#{video_id}.mp4"
  gif_path = "/tmp/gif-#{video_id}.gif"
  
  begin

    source_url = get_mp4_video_url video_id

    store_at source_url, video_path
    convert video_path, gif_path
    upload gif_path
    
  ensure

    File.delete video_path if File.exists? video_path
    File.delete gif_path if File.exists? gif_path

  end

end