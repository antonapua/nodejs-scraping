var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

  url = 'https://www.singaporehost.sg/customers/knowledgebase.php?action=displaycat&catid=40';

  request(url, function(error, response, html) {

    if (!error) {

      var $ = cheerio.load(html);

      var paths = [];

      $('a.fontsize2').each(function (){
        path = $(this).attr('href');
        title = $(this).text();
        paths.push( {'title':title , 'path':'https://www.singaporehost.sg/customers/'+path} );
      });


      // fetch the video src
      var check = [];
      for (var i = 0; i < paths.length; i++) {
        video_page = paths[i].path;
        video_title = paths[i].title;
        request(video_page, function(error, response, body) {
          if (!error) {

            var $ = cheerio.load(body);
            var video_link = $('h3').find('a').attr('href');
            video_link = 'https://www.singaporehost.sg'+video_link;
            var group = [];
            // fetch video individual
            request(video_link, function(error, response, vpage) {
              var $ = cheerio.load(vpage);
              var video_src = $('embed').attr('src');
              var title = $('title').text();
              data = [title,video_src];
              group.concat(data);
            });
            group.push('bacon','YUMmy bacon tuna sandwhich')
            console.log(group);
            fs.appendFile('output.json', JSON.stringify( group, null, 4), function(err) {})

          }
        });

      }






        res.send(check)
    }
  })


});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
