console.info("Starting application");
var express = require('express');
var request = require('request');
var app = express();


var urls = {
  "rexel.nl" : "http://www.rexel.nl",
  "elasticsearch" : "http://10.155.51.12:9200"
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

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(1337);

console.info("Application started");