var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
  request({
    method: 'GET',
    url: 'https://9gag.com'
  }, function(err, response, body){
    if(err) return console.error(err);
    // console.log(body);
    res.end(body);
  });
});

app.listen('3000');
console.log('Listening on port 3000');
exports = module.exports = app;
