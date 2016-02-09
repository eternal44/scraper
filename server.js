var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var app     = express();

app.get('/', function(req, res){
  var allData = [];
  var promiseRequest = Promise.promisify(request);
  promiseRequest({

      method: 'GET',
      url: 'https://news.ycombinator.com/'
    }
  ).then(function(result){
    console.log(result);

     $ = cheerio.load(result);

     console.log('--------------');
     allData.push( { ycombinator : [] });
     // $('.title a').each(function() {
     //   var title = this.children[0].data;
     //   if(title !== undefined){
     //     var splitTilte = title.split(' ');

     //     for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to result array
     //       allData[0].ycombinator.push(splitTilte[i]);
     //     }
     //   }
     // });
     });

    console.log(allData);
  });

var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
