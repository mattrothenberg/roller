require_relative '../convert.rb'

describe 'converting youtube videos to gifs' do
  gif_path = '/tmp/test-gif.gif'

  before do
    File.delete(gif_path) if File.exists?(gif_path)
  end

  after do
    File.delete(gif_path) if File.exists?(gif_path)
  end

  it 'produces a gif at the given path' do
    video_fixture_path = File.join(__dir__, 'fixtures/test-video.mp4')
    convert(video_fixture_path, '/tmp/test-gif.gif')

    File.open(gif_path) do |file|
      expect(file.size).not_to be File.size(video_fixture_path)
      expect(file.size).to be > 1024 * 10
    end
  end
end
