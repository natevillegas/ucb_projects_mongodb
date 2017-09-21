var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

//Mongoose models
var News = require('../models/News.js');
var Note = require('../models/Note.js');

router.get('/', function(req, res) {
    request('https://www.nytimes.com', function(error, response, html) {
        var $ = cheerio.load(html);
        $('p.title').each(function(i, element) {
            var result = {};

            result.title = $(this).text();
            result.title = result.title.replace(/ *\([^)]*\) */g, "");
            result.href = $(this).find('a').first().attr('href');

            if (result.href.charAt(0) === '/') {
              result.href = 'https://www.nytimes.com' + result.href;
            }

            var entry = new News(result);
            entry.save(function(err, doc) {
                // log any errors
                if (err) {
                    console.log(err // or log the doc
                    );
                } else {
                    console.log(doc);
                }
            });
        });
    });
    res.render('index');
});

router.get('/news', function(req, res){
  News.find({}).sort('-_id').exec(function(err, found){
    if (err) {
      console.log(err);
    } else {
      res.send(found);
    }
  });
});

router.get('/news/:id', function(req, res){
	News.findOne({'_id': req.params.id})
	.populate('notes')
	.exec(function(err, articleInfo){
		if (err){
			res.send(err);
		} else{
			res.json(articleInfo);
		}
	});
});

router.post('/news/:id', function(req, res){
	var articleID = req.params.id;
	var newNote = new Note (req.body);
	newNote.save(function(err, noteInfo){
		if (err){
			res.send(err)
		}else{
			News.findOneAndUpdate({'_id':articleID}, {$push: {"notes": noteInfo._id}})
			.exec(function(err, docs){
				if (err){
					res.send(err);
				} else{
					res.json(docs);
				}
			});
		}
	});
});

router.delete('/notes/:id', function(req, res){
  var noteID = req.params.id;
  Note.find({'_id': noteID }).remove( function(err){
    if (err) {
      res.send(err)
    } else {
      res.send('Success!');
    }
  });
});



module.exports = router;
