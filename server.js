var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var app     = express();

var allData = [];
var promiseRequest = Promise.promisify(request);

app.get('/', function(req, res){
  promiseRequest({
      method: 'GET',
      url: 'https://news.ycombinator.com/'
    }
  ).then(function(result){
    // TODO: extract as 'scrape' function
    $ = cheerio.load(result.body);

    allData.push({ ycombinator: [] });
    $('.title a').each(function() {
      var title = this.children[0].data;
      if(title !== undefined){
        var splitTilte = title.split(' ');

        for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
          allData[0].ycombinator.push(splitTilte[i]);
        }
      }
    });
  }).then(function(){
    promiseRequest({
      method: 'GET',
      url: 'https://www.reddit.com/r/python+ruby+php+perl+javascript'
    }).then(function(result){
      // TODO: extract as 'scrape' function
      $ = cheerio.load(result.body);

      allData.push({ reddit: [] });
      $('a.title').each(function() {
        var title = this.children[0].data;
        if(title !== undefined){
          var splitTilte = title.split(' ');

          for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
            allData[1].reddit.push(splitTilte[i]);
          }
        }
      });
    res.send(allData);
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
