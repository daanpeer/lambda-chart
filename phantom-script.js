const page = require('webpage').create();
const system = require('system');

const url = system.args[0];
const filename = system.args[1];
const data = system.args[2];
const requestData = JSON.parse(atob(data))

console.log('requesting page with args', system.args);
page.open(url, 'post', JSON.stringify({ chartData: requestData }), function(status) {
  page.render('/tmp/' + filename);
  phantom.exit();
});
