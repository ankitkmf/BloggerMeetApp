var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});