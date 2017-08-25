var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

// accepts and array of objects to retrieve title and path of individual video pages
function retrieve(object){
  url = object.path;
  request(url, function(error, response, html) {

    if (!error) {
      var $ = cheerio.load(html);

      $('.fontsize2').each(function (){
        title = $(this).text().toLowerCase().replace(new RegExp(" ", "g"), '-').toLowerCase().replace(new RegExp("'", "g"), '').replace(new RegExp("/", "g"), '');
        cat_title = object.title.toLowerCase().replace(new RegExp(" ", "g"), '-').toLowerCase().replace(new RegExp("'", "g"), '').replace(new RegExp("/", "g"), '');
        output = 'redirect 301 https://www.singaporehost.sg/customers/'+$(this).attr('href')+' /knowledge-base/video-tutorials/'+cat_title+'/'+title+'.php/';

        fs.appendFile('output.txt', output, function(err) {})
      });
    }

  })
}

app.get('/scrape', function(req, res) {

  url = 'https://www.singaporehost.sg/customers/knowledgebase.php?action=displaycat&catid=25';

  request(url, function(error, response, html) {

    if (!error) {

      var $ = cheerio.load(html);
      main_cat_arr = [];
      // retrieve and store main categories
      $('.control-group a').each(function (){
        main_cat_link = $(this).attr('href');
        main_cat_title = $(this).text();

        main_cat_arr.push( { 'title':  main_cat_title, 'path': 'https://www.singaporehost.sg/customers/'+main_cat_link } );
      });
      // loop through and process the subcats
      main_cat_arr.map(retrieve);




      res.send(main_cat_arr)
    }
  })


});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
