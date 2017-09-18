var express = require("express");
var passport = require("passport");
var passportauth = require("../modellayer/passportauth");
var axios = require("axios");
var log = require("../modellayer/log");
var config = require("config");
var bcrypt = require('bcrypt');
//var passportAuth = require("../modellayer/passportauth");
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

// router.post("/login", passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/'
// }));

router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log("++++In login post:" + req.session.redirectUrl);
    req.session.user = req.user;
    //console.log("Local passport user:" + JSON.stringify(req.user));
    res.redirect(req.session.redirectUrl || '/');
    // delete req.session.returnTo;
});


// router.post('/login',
//     passport.authenticate('local', {
//         successRedirect: 'back', // redirect back to the previous page
//         failureRedirect: 'back', // redirect back to the previous page
//         failureFlash: true
//     })
// );

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get("/google/callback", passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/'
// }));

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
    //console.log("2:" + req.session.returnTo);
    console.log("callback 1");
    // console.log("Google User:" + JSON.stringify(req.user));
    if (req.session.mappingObj != null) {
        console.log("req.session.mappingObj :" + JSON.stringify(req.session.mappingObj));
        //req.session.mappingObj = "";
        var mapUser = req.session.mappingObj;
        delete req.session.mappingObj;
        console.log("mapping found");
        passportauth.mapGoogleUser(req.user, mapUser).then(function(results) {
            // console.log("mapGoogleUser results:" + JSON.stringify(results));
            if (results != "") {
                console.log("data not null, mapUser:" + JSON.stringify(mapUser));
                console.log("mapUser.pageURL:" + mapUser.pageURL);
            } else
                console.log("data null");
            res.redirect(mapUser.pageURL || '/');
        }).catch(function(error) {
            console.log("mapGoogleUser ,error:" + error);
            res.redirect(req.session.redirectUrl || '/');
            //  reject("");
        });

        // res.redirect(req.session.redirectUrl || '/');
    } else {
        console.log("mapping not found");
        passportauth.validateGoogleUser(req.user).then(function(results) {

            if (results != "") {
                req.session.user = results;
                // console.log("google session results:" + JSON.stringify(req.session.user));
                console.log("data not null");
            } else
                console.log("data null");
            res.redirect(req.session.redirectUrl || '/');
        }).catch(function(error) {
            console.log("Error in inseration Google user in db ,error:" + error);
            res.redirect(req.session.redirectUrl || '/');
            //  reject("");
        });
    }

    // delete req.session.returnTo;
});

router.get("/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/'
}));
router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});