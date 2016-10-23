require_relative '../trimming.rb'

describe 'Trimming the video' do
  trimmed_video = '/tmp/trimmed-video.mp4'

  before do
    File.delete(trimmed_video) if File.exists?(trimmed_video)
  end

  after do
    File.delete(trimmed_video) if File.exists?(trimmed_video)
  end

  it 'trims to the new start and end times' do

    video_fixture_path = File.join(__dir__, 'fixtures/test-video.mp4')


    trim(video_fixture_path, trimmed_video, 10, 14)

    File.open(trimmed_video) do |file|
      expect(file.size).to be < File.size(video_fixture_path)
    end

  end

end