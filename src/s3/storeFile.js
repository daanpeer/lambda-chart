import aws from 'aws-sdk'

const s3 = new aws.S3()
const storeFileToS3 = (filename, file) =>
  new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: file
    }, (err, data) => {
      console.log('saving to s3', 'data', data, 'error', err)
      if (err !== null) {
        return reject(err)
      }
      return resolve(data)
    })
  })

export default storeFileToS3
