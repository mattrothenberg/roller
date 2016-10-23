def trim(video_path, destination, start_seconds, end_seconds)
  start_timestamp = Time.at(start_seconds).utc.strftime("%H:%M:%S")
  end_timestamp = Time.at(end_seconds).utc.strftime("%H:%M:%S")

  `ffmpeg -i #{video_path} -ss #{start_timestamp} -to #{end_timestamp} #{destination}`


end