import aws from 'aws-sdk'

const s3 = new aws.S3()
const retrieveFileFromS3 = (filename, params) => {
  return new Promise((resolve, reject) => {
    console.log('checking for file', params)
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export default retrieveFileFromS3
