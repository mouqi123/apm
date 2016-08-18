var http = require('http');
var static_module = require('./static_module');

var server = http.createServer();

server.on('request', (request, response) => {
	var headers = request.headers;
	var method = request.method;
	var url = request.url;
	console.log(url);
	console.log(method);
	console.log(headers);
	var body = [];
	static_module.getStaticFile(url, request, response);

});

server.listen(8000);