var express = require('express');
var fs = require('fs');

var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var _ = require('underscore');

var app     = express();

var allData = [];
var promiseRequest = Promise.promisify(request);
var excludedWords =['is', 'why', 'the', 'this', 'not', 'so', 'if', 'to', 'how', 'for', 'of', 'and', 'a', 'on', 'no', 'in', 'it', 'let', 'be', 'get'];

var countWords = function(collection){
  return _.reduce(collection, function(memo, element){
    element = element.toLowerCase();
    if(!(_.contains(excludedWords, element))){
      memo[element]++ || (memo[element] = 1);
    }
    return memo;
  }, {});
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('./'));

app.get('/data', function(req, res){
  promiseRequest({
      method: 'GET',
      url: 'https://news.ycombinator.com/'
    }
  ).then(function(result){
    // TODO: extract as 'scrape' function
    $ = cheerio.load(result.body);

    $('.title a').each(function() {
      var title = this.children[0].data;
      if(title !== undefined){
        var splitTilte = title.split(' ');

        for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
          allData.push(splitTilte[i]);
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

      $('a.title').each(function() {
        var title = this.children[0].data;
        if(title !== undefined){
          var splitTilte = title.split(' ');

          for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
            allData.push(splitTilte[i]);
          }
        }
      });
      fs.writeFile("flare.json", JSON.stringify(allData), function(err){
        if(err) console.err('file didn\'t save');
        console.log('file saved');
      });
      // console.log(countWords(allData));
      res.send(countWords(allData));
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
