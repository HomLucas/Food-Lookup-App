var statix = require('node-static');
var http  = require('http');
var dynamic = require("./dynamic");
var url = require("url");

var fileServer = new statix.Server('./public');

function handler (request,response) {
    // request.addListener('end',function () {
    // fileServer.serve(request, response)}).resume();

var urlRecieved = request.url; // maybe complex string

    var urlObj = url.parse(urlRecieved);
    var pathname = urlObj.pathname; // maybe simpler string
    var parts = pathname.split("/"); // array of strings

    if (parts[1] == "dyn") {  // parts[0] is ""
    	
	dynamic.dynamic(response,urlObj);
	}
    else {

	  request.addListener('end',function () {
    fileServer.serve(request, response)}).resume();

	}
}

server = http.createServer(handler);
server.listen(20015);


