import path from 'path'
import childProcess from 'child_process'

const phantomRenderer = (data, filename) => new Promise((resolve, reject) => {
  const processArgs = [
    // "--debug=true",
    path.join(__dirname, 'phantom-script.js'),
    process.env.RENDER_GRAPH_URL,
    filename,
    new Buffer(JSON.stringify(data)).toString('base64')
  ]

  childProcess.execFile('./phantomjs', processArgs, function (error, stdout, stderr) {
    console.log(error, stdout, stderr)
    if (error) {
      reject(error)
    }
    if (stderr) {
      reject(error)
    }
    resolve()
  })
})

export default phantomRenderer
