console.info("Starting application");
var express = require('express');
var request = require('request');
var app = express();
var fs = require("fs");


var urls = {
  "rexel.nl" : "http://www.rexel.nl",
  //"elasticsearch" : "http://10.155.51.12:9200"
	"elasticsearch" : "http://localhost:9200"
}

app.use(express.static(__dirname + '/public'));


app.use('/proxy/:url/', function(req, res) {

  console.log("Url to request is : ", urls[req.params.url]+'/'+req.url);
  req.pipe(request(urls[req.params.url]+'/'+req.url, function(err, res, body){ 
  	if(err){
  		console.log("Error append:", err)
  	}
  })).pipe(res);
});

app.use('/:country/img/:i/:j', function(req,res,err) {
console.log('Starting directory: ' + process.cwd());
  var img = fs.readFileSync(req.params.country+"/img/i"+req.params.i+"j"+req.params.j,'base64');
  console.error(err.stack);
  res.status(200).send(img);
});

app.use('/:country/files/:i/:j', function(req,res,err) {
console.log('Starting directory: ' + process.cwd());
  var file = fs.readFileSync(req.params.country+"/files/i"+req.params.i+"j"+req.params.j+".csv",'utf-8');
  console.error(err.stack);
  res.status(200).send(file);
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(1337);

console.info("Application started");
