var User = require('.././models/user');
var getBooksFromDB = require('.././middleware/getbooksfromdb');
var searchBooksInDB = require('.././middleware/searchBooksInDB');

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('index', {title: 'OPDS Builder'});
  });

  app.post('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/login', function (req, res) {
    res.render('login', {title: req.flash('signupMessage')});
  });

  app.post('/login', passport.authenticate('local-signup', {
    successRedirect: '/cabinet',
    failureRedirect: '/login',
    failureFlash: true
  }));


  app.get('/getBooksFromDB', function (req, res) {
    getBooksFromDB(function (books) {
      res.send(books);
    });
  });

  app.get('/searchBooksInDB', function (req, res) {
    searchBooksInDB(req.param('searchValue'), req.param('selectedField'), function (books) {
      res.send(books);
    });
  });


  app.get('/cabinet', isLoggedIn, function (req, res) {
    res.render('cabinet', {
      title: 'Ваш кабинет',
      user: req.user.facebook.name || req.user.google.name || req.user.local.username.split("@")[0] || 'anonymous!'
    });
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect: '/cabinet',
        failureRedirect: '/login'
      }));

  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

  app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/cabinet',
        failureRedirect: '/login'
      }));

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};

