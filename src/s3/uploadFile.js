import aws from 'aws-sdk'

const s3 = new aws.S3()
const uploadFileToS3 = (filename, file) =>
  new Promise((resolve, reject) => {
    s3.upload({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: file,
      ACL: 'public-read'
    }, (err, data) => {
      console.log('saving to s3', 'data', data, 'error', err)
      if (err !== null) {
        return reject(err)
      }
      return resolve(data)
    })
  })

export default uploadFileToS3
