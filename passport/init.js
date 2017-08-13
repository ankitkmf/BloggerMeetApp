var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
//var MongoDB = require("mongodb").MongoClient;
//var ObjectId = require("mongodb").ObjectID;
//var db = require('../models/db');
//var bcrypt = require('bcrypt');

passport.use(new LocalStrategy(function(username, password, done) {

    console.log("username : " + username);
    console.log("password : " + password);

    var user = { "username": username, "password": "vaskar" };

    if (username === "vaskar" && password === "vaskar") {
        console.log(user);
        return done(null, user);
    } else {
        console.log("Error user doesnot match");
        return done(null, false);
    }

    // db.get().collection('users').findOne({ username: username }, function(err, user) {
    //     if (err || user == undefined) {
    //         console.log("user not found");
    //         return done(null, false); //'Incorrect username.'
    //     } else {
    //         bcrypt.compare(password, user.password, function(err, result) {
    //             if (result) {
    //                 console.log("user pwd match");
    //                 return done(null, user);
    //             } else {
    //                 console.log("user pwd did not match");
    //                 return done(null, false); //, { message: 'Incorrect password.' });
    //             }
    //         });
    //     }
    // });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});