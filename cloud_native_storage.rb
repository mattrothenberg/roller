require 'aws-sdk'
require 'securerandom'

def upload(file_path)
  region = 'us-west-2'
  s3 = Aws::S3::Resource.new(region: region)

  uuid = SecureRandom.uuid
  obj = s3.bucket('objectobjectgifs').object(uuid)
  obj.upload_file(file_path)

  "https://s3-#{region}.amazonaws.com/objectobjectgifs/#{uuid}"
end