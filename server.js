var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
  request({
    method: 'GET',
    url: 'https://news.ycombinator.com/'
  }, function(err, response, body){
    if (err) return console.error(err);

    $ = cheerio.load(body);
    var result = [];

    $('.title a').each(function() {
      if(this.children[0].data !== undefined){
        result.push(this.children[0].data);
      }
    });
    res.send(result);
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
