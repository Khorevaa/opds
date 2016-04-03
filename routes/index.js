var User = require('.././models/user');

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

  app.get('/cabinet', isLoggedIn, function (req, res) {
    res.render('cabinet', {
      title: 'Ваш кабинет',
      user: req.user.facebook.name || req.user.google.name || req.user.local.username.split("@")[0] || 'anonimus!'
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

function displayName(req) {
  console.log(req.user);
  if (req.user.local) return req.user.local.username;
  if (req.user.facebook.name != '') {
    var name = req.user.facebook.name;
    console.log('name = ' + name);
    return name;
  }
  if (req.user.google) return req.user.google.name;
}