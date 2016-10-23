def convert(video_path, gif_destination_path)
  `ffmpeg -y -i #{video_path} -vf fps=10,palettegen palette.png`
  `ffmpeg -i "#{video_path}" -i 'palette.png' -filter_complex "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" "#{gif_destination_path}"`
end