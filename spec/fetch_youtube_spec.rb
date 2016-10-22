require_relative '../youtube.rb'

describe 'fetching youtube things' do

  it 'gets the youtube things' do

    source_url = get_mp4_video_url('CMNry4PE93Y')

    expect(source_url).to include('googlevideo.com')
    expect(source_url).to include('mime=video%2Fmp4')
  end
end

describe 'downloading youtube things' do
  file_path = '/tmp/test-video.mp4'

  before do
    File.delete(file_path) if File.exists?(file_path)
  end

  after do
    File.delete(file_path) if File.exists?(file_path)
  end

  it 'stores the file at the given path' do
    video_url = get_mp4_video_url('CMNry4PE93Y')
    store_at(video_url, file_path)
    File.open(file_path) do |file|
      expect(file.size).to be > 1024 * 10
    end
  end
end