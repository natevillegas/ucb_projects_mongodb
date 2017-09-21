var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Routes
var routes = require('./routes/index');

var app = express();

//MongoDB setup
var link = 'mongodb://heroku_vk9td9gb:88n0klqs7vm0qbhlag9rp3v3tm@ds129344.mlab.com:29344/heroku_vk9td9gb';

//local mongo instance

// var link = 'mongodb://localhost/news-scraper';

//Drop DB (was using this for development)
// mongoose.connect(link, function() {
//     mongoose.connection.db.dropDatabase();
// });

mongoose.connect(link);

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('database error', err);
});

db.once('open', function() {
    console.log("Mongoose is connected!");
});

//set handlebars as view engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
