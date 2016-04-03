var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var HttpError = require('./error').HttpError;
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var app = express();
app.set('port', config.get('port'));
mongoose.connect(config.get('mongoose:uri'), config.get('options'));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./middleware/passport')(passport);

require('./routes')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(function (err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
 });*/

var server = http.createServer(app);
server.listen(config.get('port'), function () {
  logger('Express server listening on port ' + config.get('port'));
});
module.exports = app;
