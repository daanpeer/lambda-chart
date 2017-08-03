import fs from 'fs';
import path from 'path'
import childProcess from 'child_process'
import { renderChart as renderReactChart } from './chart'
import aws from 'aws-sdk'

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const s3 = new aws.S3();
const retrieveFileFromS3 = (filename) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    };

    console.log('checking for file', params);

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

export const requestChart = (event, context, callback) => {
  process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

  console.log('event with body', event.body)
  if (!event.body) {
    return callback(null, {
      statusCode: 422,
      body: "Please provide a filename (no body)",
    })
  }

  const requestData = JSON.parse(event.body);
  if (!requestData || !requestData.filename) {
    return callback(null, {
      statusCode: 422,
      body: "Please provide a filename",
    })
  }

  const filename = requestData.filename;

  // console.log('got filename', filename);
  // console.log('registered event', event);
  // console.log('env variables', process.env);

  // try {
  //   const file = await retrieveFileFromS3(filename)
  // } catch (err) 
  //   console.log('error retrieving file', err);
  // }

  const processArgs = [
    "--debug=true",
    path.join(__dirname, 'phantom-script.js'),
    process.env.RENDER_GRAPH_URL,
    filename,
    new Buffer(JSON.stringify(data)).toString('base64')
  ];

  console.log('calling phantom with arg', processArgs);
  
  childProcess.execFile('./phantomjs', processArgs, function(error, stdout, stderr) {
    console.log(error, stdout, stderr);
    if (error) {
      console.log(error)
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(error),
      })
    }
    if (stderr) {
      console.log(stderr)
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(error),
      })
    }

    console.log('writing file to bucket');
    const file = fs.readFileSync(`/tmp/${filename}`)
    console.log('found file', file);

    params.Body = file;
    s3.putObject(params, (err, data) => {
      console.log(err)
      if (err) {
        return callback(null, {
          statusCode: 500,
          body: JSON.stringify(error),
        })
      } else {
        return callback(null, {
          statusCode: 200,
          body: file,
        })
      }
    });
  });
}

export const renderChart = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: renderReactChart(event.data),
  };
  callback(null, response);
}
