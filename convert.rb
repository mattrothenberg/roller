def convert(video_path, gif_destination_path)
  begin

    `ffmpeg -y -i #{video_path} -vf fps=10,palettegen '/tmp/palette.png'`
    `ffmpeg -i "#{video_path}" -i '/tmp/palette.png' -filter_complex "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" "#{gif_destination_path}"`

  ensure

    File.delete('/tmp/palette.png') if File.exists? '/tmp/palette.png'

  end
end