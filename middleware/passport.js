var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , LocalStrategy = require('passport-local').Strategy;

var config = require('.././config');
var crypto = require('crypto');

var User = require('.././models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({'local.username': email}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        if (EncriptedPassword(password) === user.local.password) {
                            return done(null, user);
                        } else {
                            return done(null, false, req.flash('signupMessage', 'Пароль не верен.'));
                        }
                    } else {
                        var newUser = new User();
                        newUser.local.username = email;
                        newUser.local.email = email;
                        newUser.local.password = EncriptedPassword(password);

                        newUser.save(function (err) {
                            if (err) throw err;
                            return done(null, newUser);
                        })
                    }
                })
            })
        }));

    passport.use(new FacebookStrategy({
            clientID: config.get('facebookAuth:clientID'),
            clientSecret: config.get('facebookAuth:clientSecret'),
            callbackURL: config.get('facebookAuth:callbackURL'),
            "profileFields": ["id", "birthday", "emails", "first_name", "gender", "last_name"]
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if (err) return done(err);
                    if (user) return done(null, user);
                    else {
                        var newUser = new User();
                        console.log('profile.id = ' + profile.id + ', givenName = ' + profile.name.givenName);
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err) throw err;
                            return done(null, newUser);
                        })
                    }
                })
            });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: config.get('googleAuth:clientID'),
            clientSecret: config.get('googleAuth:clientSecret'),
            callbackURL: config.get('googleAuth:callbackURL'),
            profileFields: ['profiles', 'emails', 'id', 'name', 'displayName', 'username', 'photos', 'hometown', 'profileUrl', 'friends']
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'google.id': profile.id}, function (err, user) {
                    console.log(profile.toJSON);
                    if (err) return done(err);
                    if (user) return done(null, user);
                    else {
                        console.log(profile.id);
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err) throw err;
                            return done(null, newUser);
                        })
                    }
                })
            });
        }
    ));
};

function EncriptedPassword(password) {
    var newPass = crypto.createHmac('sha1', config.get('cryptKey')).update(password).digest('hex');
    return newPass;
};
