var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
  request({
    method: 'GET',
    url: 'https://github.com/showcases'
  }, function(err, response, body){
    if (err) return console.error(err);

    // Tell Cherrio to load the HTML
    $ = cheerio.load(body);
    var result = [];
    $('li.collection-card').each(function() {
      var href = $('a.collection-card-image', this).attr('href');
      if (href.lastIndexOf('/') > 0) {
        result.push($('h3', this).text());
      }
    });
    res.send(result);
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
