/**
 * @author mackie_mou
 * this module is used for static web responseource request.
 */
var fs = require('fs');
var sys = require('util');
var http = require('http');
var url = require('url');
var path = require('path');

var BASE_DIR = process.cwd();
var CONF = BASE_DIR + '/conf/';
var STATIC = BASE_DIR + '/';
var mimeMap = getMimeConf(); // responseource map, refer to http://www.freeformatter.com/mime-types-list.html#mime-types-list for detail
var CACHE_TIME = 60*60*24*365;

exports.getStaticFile = (pathname, request, responseponse) => {

	// get extend type of the file
	var extname = path.path.extname(pathname);
	extname = extname ? extname.slice(1) : '';
	var absolutePath = STATIC + pathname;
	var mimeType = mimeMap[extname] ? mime[extname] : 'text/plain';
	console.log(`client request mime type is ${extname}`);

	fs.stat(absolutePath, (err, stats) => {
		if (err) {
			console.log(absolutePath + " is not found.")
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.write('Sorry, Not Found This Source.');
            response.end();
        } else {
            var lastModified = stats.mtime.toUTCString();
                
            if(mimeMap[extname]){
                var date = new Date();
                date.setTime(date.getTime() + CACHE_TIME * 1000);
                response.setHeader("Expires", date.toUTCString());
                response.setHeader("Cache-Control", "max-age=" + CACHE_TIME);
                response.setHeader("Last-Modified", lastModified);
            }
            if(request.headers['if-modified-since'] && lastModified == req.headers['if-modified-since'] ){
                response.writeHead(304, "Not Modified");
                response.end();
            }else{

            	fs.readFile(absolutePath, "binary", (err, data) => {
                    if(err){
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.end(err);
                    }else{
                        response.writeHead(200, {'Content-Type': mimeType});
                        response.write(data, "binary");
                        response.end();
                    }
                })
            }
        }
	});
	

}

function getMimeConf() {
	var routerMsg = {};
	try{
		var str = fs.readFileSync(CONF + 'mime_type.json', 'utf8');
        routerMsg = JSON.parse(str);
    }catch(e){
        console.error("JSON parse fails");
    }
    return routerMsg;
}