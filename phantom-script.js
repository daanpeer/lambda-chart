const page = require('webpage').create();
const system = require('system');

const url = system.args[1];
const filename = system.args[2];
const data = system.args[3];
const requestData = JSON.parse(atob(data))

console.log('retrieved request data', JSON.stringify(requestData));
console.log('requesting page with args', system.args);

page.onResourceRequested = function (request) {
  console.log('Request ' + JSON.stringify(request, undefined, 4));
};

page.open(url, 'post', JSON.stringify({ chartData: requestData }), function(status) {
  page.render('/tmp/' + filename);
  phantom.exit();
});
