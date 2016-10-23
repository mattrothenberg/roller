require_relative './youtube.rb'
require_relative './convert.rb'
require_relative './cloud_native_storage.rb'
require_relative './trimming.rb'

class GifTooLong < ArgumentError; end
class VideoTooLong < ArgumentError; end

def convert_video_use_case(video_id, start_seconds, end_seconds)
  video_path = "/tmp/video-#{video_id}.mp4"
  trimmed_video_path = "/tmp/trimmed-video-#{video_id}.mp4"
  gif_path = "/tmp/gif-#{video_id}.gif"
  
  begin
    video_info = get_mp4_video_info video_id

    raise GifTooLong.new if end_seconds - start_seconds > 15
    raise VideoTooLong.new if video_info.length > 20 * 60

    store_at video_info.url, video_path
    trim video_path, trimmed_video_path, start_seconds, end_seconds
    convert trimmed_video_path, gif_path
    upload gif_path
    
  ensure

    File.delete video_path if File.exists? video_path
    File.delete gif_path if File.exists? gif_path
    File.delete trimmed_video_path if File.exists? trimmed_video_path

  end

end