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
var schedule = require('node-schedule');

var app = express();
app.set('port', config.get('port'));
mongoose.connect(config.get('mongoose:uri'), config.get('options'));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

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
app.use(express.static(path.join(__dirname, 'middleware')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
});

var getNewBooks = require('./middleware/newbooks');
var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 12;
rule.minute = 0;

schedule.scheduleJob(rule, function () {
  getNewBooks();
});

var server = http.createServer(app);
server.listen(config.get('port'), function () {
  logger('Express server listening on port ' + config.get('port'));
});
module.exports = app;
