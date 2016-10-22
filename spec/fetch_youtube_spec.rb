require_relative '../youtube.rb'

describe 'fetching youtube things' do

  it 'gets the youtube things' do

    source_url = get_mp4_video_url('CMNry4PE93Y')

    expect(source_url).to include('googlevideo.com')
    expect(source_url).to include('mime=video%2Fmp4')
  end
end
