require_relative './youtube.rb'
require_relative './convert.rb'
require_relative './cloud_native_storage.rb'
require_relative './trimming.rb'

def convert_video_use_case(video_id, start_seconds, end_seconds)
  video_path = "/tmp/video-#{video_id}.mp4"
  trimmed_video_path = "/tmp/trimmed-video-#{video_id}.mp4"
  gif_path = "/tmp/gif-#{video_id}.gif"
  
  begin

    source_url = get_mp4_video_url video_id

    store_at source_url, video_path
    trim video_path, trimmed_video_path, start_seconds, end_seconds
    convert trimmed_video_path, gif_path
    upload gif_path
    
  ensure

    File.delete video_path if File.exists? video_path
    File.delete gif_path if File.exists? gif_path
    File.delete trimmed_video_path if File.exists? trimmed_video_path

  end

end