def convert(video_path, gif_destination_path)
  `ffmpeg -i "#{video_path}" -pix_fmt rgb24 -r 4 "#{gif_destination_path}"`
end