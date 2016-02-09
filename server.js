var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
  res.end('hello');
});

app.listen('3000');
console.log('Listening on port 3000');
exports = module.exports = app;
