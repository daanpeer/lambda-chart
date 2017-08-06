import fs from 'fs'
import { renderChart as renderReactChart } from './src/react'
import phantomRenderer from './src/phantom-renderer'
import { storeFileToS3 } from './src/s3'

export const requestChart = async (event, context, callback) => {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`

  console.log('event with body', event.body)
  if (!event.body) {
    return callback(null, {
      statusCode: 422,
      body: 'Please provide a filename (no body)'
    })
  }

  const requestData = JSON.parse(event.body)
  if (!requestData || !requestData.filename || !requestData.chartData) {
    return callback(null, {
      statusCode: 422,
      body: 'Please provide data and a filename'
    })
  }

  const filename = requestData.filename
  const data = requestData.chartData

  try {
    await phantomRenderer(data, filename)
  } catch (err) {
    console.log('error occured', err)
    return callback(null, {
      statusCode: 500,
      body: err
    })
  }

  const file = fs.readFileSync(`/tmp/${filename}`)

  try {
    await storeFileToS3(filename, file)
  } catch (err) {
    console.log('error occured storing files', err)
    return callback(null, {
      statusCode: 500,
      body: err
    })
  }

  return callback(null, {
    statusCode: 200,
    body: filename
  })
}

export const renderChart = (event, context, callback) => {
  console.log('event with body', event.body)
  if (!event.body) {
    return callback(null, {
      statusCode: 422,
      body: 'Please provide a filename (no body)'
    })
  }

  const requestData = JSON.parse(event.body)
  if (!requestData || !requestData.chartData) {
    return callback(null, {
      statusCode: 422,
      body: 'Please provide data and a filename'
    })
  }

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: renderReactChart(requestData.chartData)
  }
  callback(null, response)
}
