var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var passportauth = require("../modellayer/passportauth");

passport.use(new LocalStrategy(function(username, password, done) {

    console.log("username : " + username);
    console.log("password : " + password);

    var user = {};

    passportauth.find(username, password).then((response) => {
        if (response != null && response.data != null && response.data.count > 0) {

            user = response.data;

            console.log("Passport api response:" + user.result[0]._id);
            console.log("Passport api response:" + user.result[0].username);
            console.log("Passport api response:" + user.result[0].password);

            bcrypt.compare(password, user.result[0].password, function(err, result) {
                if (result) {
                    console.log("user pwd match");
                    user.result[0].message
                    return done(null, user);
                } else {
                    console.log("user pwd did not match");
                    return done(null, false); //, { message: 'Incorrect password.' });
                }
            });
        } else {
            console.log("Error user doesnot match");
            return done(null, false);
        }

    }).catch(function(err) {
        console.log("passport.find exception:" + err);
        return done(null, false);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});