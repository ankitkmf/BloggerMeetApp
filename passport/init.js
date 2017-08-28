var passport = require("passport");
var axios = require("axios");
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt');
var passportauth = require("../modellayer/passportauth");
var log = require("../modellayer/log");
var config = require("config");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

passport.use(new LocalStrategy(function(username, password, done) {
    log.logger.info("Passport Init : User Name : " + username + " , Password : " + password);
    var user = {};
    passportauth.find(username).then((response) => {
        if (response != null && response.data != null && response.data.count > 0) {

            user = response.data;

            log.logger.info("Passport Init : passportauth find : User _id : " + user.result[0]._id + " , name : " + user.result[0].username);

            bcrypt.compare(password, user.result[0].password, function(err, result) {
                if (result) {
                    console.log("user pwd match");
                    log.logger.info("Passport Init : password match : User _id : " + user.result[0]._id + " , name : " + user.result[0].username);
                    user = user.result[0];
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
        if (profile.emails[0].value != null && profile.id != null) {
            passportauth.find(profile.emails[0].value).then((response) => {
                if (response != null && response.data != null && response.data.count > 0) {
                    var user = {};
                    user = response.data.result[0];
                    console.log("Google user found in DB");
                    return done(null, user);
                } else {
                    console.log("Google user doesn't found");
                    let path = serviceURL + "/saveSignUp/";
                    var user = {
                        "id": profile.id,
                        "username": profile.displayName,
                        "userImage": profile.photos != null ? profile.photos[0].value : "",
                        "authType": "google"
                    };
                    var result = {
                        "username": profile.displayName,
                        "name": profile.displayName,
                        "email": profile.emails[0].value,
                        "password": bcrypt.hashSync("test", 10),
                        "authType": "google",
                        "profileID": profile.id,
                        "userImage": profile.photos != null ? profile.photos[0].value : ""
                    };

                    axios.post(path, result)
                        .then(function(response) {
                            console.log("Google user inserted in db ");
                            return done(null, user);
                        })
                        .catch(function(error) {
                            console.log("Error in inseration Google user in db ");
                            return done(null, false);
                        });
                }
            }).catch(function(err) {
                console.log("passport.find exception:" + err);
                log.logger.error("Passport Init : passportauth find : User Name : " + username + " Error : " + err);
                return done(null, false);
            });
        }
    }
));

passport.use(new FacebookStrategy({
        clientID: "gt6hy",
        clientSecret: "dsfdsfdffdsf",
        callbackURL: "http://localhost:2000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("profile.id:" + profile.id);
        var user = {};
        user._id = profile.id;
        user.username = "vaskarfb";
        user.authType = "facebook";
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});