var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require('bcrypt');
var passportauth = require("../modellayer/passportauth");
var log = require("../modellayer/log");

passport.use(new LocalStrategy(function(username, password, done) {

    log.logger.info("Passport Init : User Name : " + username + " , Password : " + password);

    var user = {};

    passportauth.find(username, password).then((response) => {
        if (response != null && response.data != null && response.data.count > 0) {

            user = response.data;

            log.logger.info("Passport Init : passportauth find : User _id : " + user.result[0]._id + " , name : " + user.result[0].username);

            bcrypt.compare(password, user.result[0].password, function(err, result) {
                if (result) {
                    console.log("user pwd match");
                    log.logger.info("Passport Init : password match : User _id : " + user.result[0]._id + " , name : " + user.result[0].username);
                    return done(null, user);
                } else {
                    console.log("user pwd does not matched");
                    log.logger.error("Passport Init : password does not match : User _id : " + user.result[0]._id + " , name : " + user.result[0].username);
                    return done(null, false);
                }
            });
        } else {
            console.log("Error : user doesnot match");
            log.logger.error("Passport Init : passportauth find : User Name : " + username + " unavailable.");
            return done(null, false);
        }

    }).catch(function(err) {
        console.log("passport.find exception:" + err);
        log.logger.error("Passport Init : passportauth find : User Name : " + username + " Error : " + err);
        return done(null, false);
    });
}));

passport.use(new GoogleStrategy({
        clientID: "953892900929-tvldpm1p7c0d3ak5atanrhdufj0mca2r.apps.googleusercontent.com",
        clientSecret: "ZH-GU8fMKxJhZsKopce7jfG3",
        callbackURL: "http://localhost:2000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("profile.id:" + profile.id);
        //var user = new user();
        var user = {};
        user._id = profile.id;
        user.username = "ankit";
        console.log("user :" + JSON.stringify(user));
        return done(null, user);
        // user.token = accessToken;
        //  user.name = profile.displyName;
        //  user.email = profile.emails[0].value;
        //return cb(err, user);
        // User.findOrCreate({ googleId: profile.id }, function(err, user) {
        //     return cb(err, user);
        // });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});