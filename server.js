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
  var wordCount = {
    "name": "flare",
    "children": [
    ]
  };
  _.each(collection, function(element){
    console.log('----', element.site);
    wordCount.children = {
      name: element.site,
      'children': []
    };
    wordCount.children.children.push(_.reduce(element.words, function(memo, element){
      element = element.toLowerCase();
      if(!(_.contains(excludedWords, element))){
        memo[element]++ || (memo[element] = 1);
      }
      return memo;
    }, {}));
  });

  console.log(wordCount);
  // wordCount[0].name = 'ycombinator';
  return wordCount;
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

    // this code will be redundant after you pass it through countWords()
    allData.push({
      site: 'ycombinator',
      words: []
    });
    $('.title a').each(function() {
      var title = this.children[0].data;
      if(title !== undefined){
        var splitTilte = title.split(' ');

        for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
          allData[0].words.push(splitTilte[i]);
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

      // this code will be redundant after you pass it through countWords()
      allData.push({
        site: 'reddit',
        words: []
      });
      $('a.title').each(function() {
        var title = this.children[0].data;
        if(title !== undefined){
          var splitTilte = title.split(' ');

          for (var i = 0; i < splitTilte.length; i++){ // couldn't concat this to allData array
            allData[1].words.push(splitTilte[i]);
          }
        }
      });
      fs.writeFile("flare.json", JSON.stringify(countWords(allData)), function(err){
        if(err) console.err('file didn\'t save');
        console.log('file saved');
      });
      var wordCount = countWords(allData);
      console.log(wordCount);
      var JSONmap = mapCount(wordCount.children.children[0]);
      // console.log(JSONmap);
      // console.log(allData[0].words);
      // console.log(allData);
      var finalObject = {
        "name": "flare",
        "children": [
          {
            "name": "reddit",
            "children": JSONmap
          },
          {
            "name": "hackernews",
            "children": JSONmap
          },

        ]
      };
      res.send(finalObject);
    });
  });
});

function mapCount(obj){
  // console.log('------', obj);
  var map = [];
  for(var key in obj){
    map.push({'name': key, 'size': obj[key] * 1000});
  }

  return map;
}
var port = process.env.PORT || 3000;
app.listen(port);
console.log(port);
exports = module.exports = app;
