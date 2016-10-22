require_relative '../cloud_native_storage.rb'

require 'open-uri'

describe 'Uploading files off the filesystem' do
  it 'gives a link with the same contents as the filesystem' do
    dummy_file_path = File.join(__dir__, 'fixtures/dummy-gif.gif')

    cloud_native_link = upload(dummy_file_path)

    open(cloud_native_link) do |file|
      expect(file.size).to eq File.size(dummy_file_path)
      expect(cloud_native_link).to include('http')
      expect(cloud_native_link).not_to eq dummy_file_path
    end
  end
end

