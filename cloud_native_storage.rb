require 'aws-sdk'
require 'securerandom'

def upload(file_path)
  s3 = Aws::S3::Resource.new(region:'us-west-2')

  uuid = SecureRandom.uuid
  obj = s3.bucket('objectobjectgifs').object(uuid)
  obj.upload_file(file_path)

  "https://s3-us-west-2.amazonaws.com/objectobjectgifs/#{uuid}"
end