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
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

require('./routes')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(config.get('port'), function () {
  logger('Express server listening on port ' + config.get('port'));
});
module.exports = app;
