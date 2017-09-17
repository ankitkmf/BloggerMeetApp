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
    // console.log("callback 1");
    // console.log("Google User:" + JSON.stringify(req.user));
    if (req.session.mappingObj != null) {
        // console.log("req.session.mappingObj :" + JSON.stringify(req.session.mappingObj));
        //req.session.mappingObj = "";
        delete req.session.mappingObj;
        console.log("mapping found");
        res.redirect(req.session.redirectUrl || '/');
    } else {
        console.log("mapping not found");
        passportauth.validateGoogleUser(req.user).then(function(results) {
            console.log("google results:" + JSON.stringify(results));
            if (results != "")
                console.log("data not null");
            else
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
    // delete req.session;
    res.redirect('/');
});