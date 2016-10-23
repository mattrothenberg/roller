require_relative '../youtube.rb'

describe 'fetching youtube videos' do
  it 'gets the youtube videos' do
    video = get_mp4_video_info('CMNry4PE93Y')

    expect(video.url).to include('googlevideo.com')
    expect(video.url).to include('mime=video%2Fmp4')
    expect(video.length).to be > 10
  end
end

describe 'downloading youtube videos' do
  file_path = '/tmp/test-video.mp4'

  before do
    File.delete(file_path) if File.exists?(file_path)
  end

  after do
    File.delete(file_path) if File.exists?(file_path)
  end

  it 'stores the file at the given path' do
    video = get_mp4_video_info('CMNry4PE93Y')
    store_at(video.url, file_path)
    File.open(file_path) do |file|
      expect(file.size).to be > 1024 * 10
    end
  end
end
