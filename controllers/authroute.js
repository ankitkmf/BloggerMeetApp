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

// router.post('/login', passport.authenticate('local'), function(req, res) {
//     console.log("++++In login post:" + req.session.redirectUrl);
//     req.session.user = req.user;
//     //console.log("Local passport user:" + JSON.stringify(req.user));
//     res.redirect(req.session.redirectUrl || '/');
//     // delete req.session.returnTo;
// });

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log("Step 1");
            next(err);
            return
        }
        // User does not exist
        if (!user) {
            console.log("Step 2, Invalid email or password");
            //req.flash('error', 'Invalid email or password');
            req.flash("error", "Invalid username or password");
            // res.locals.messages = req.flash("error22", "Invalid username or password");
            res.redirect('/');
            return
        }
        req.logIn(user, function(err) {
            // Invalid password
            if (err) {
                console.log("Step 3, Invalid email or password");
                req.flash("error", "Invalid username or password");
                // req.flash('error', 'Invalid email or password');
                // req.flash("messages", { "error2": "Invalid username or password" });
                // req.flash("error", "Invalid username or password");
                // res.locals.messages = req.flash("messages", { "error": "Invalid username or password" });
                next(err);
                return
            }
            console.log("Step 4");
            req.session.user = req.user;
            res.redirect(req.session.redirectTo || '/');
            return
        });
    })(req, res, next);
});


// router.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), (req, res) => {
//     // if (req.user.isAdmin === true) {
//     //     res.redirect('/admin/gifts?filter=review');
//     // }
//     // if (req.user.isAdmin === false) {
//     //     res.redirect('/dashboard/received');
//     // }
//     req.session.user = req.user;
//     res.redirect(req.session.redirectTo || '/');
// });

// router.post("/login", passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/'
// }));


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google'), function(req, res) {
    // if (req.session.mappingObj != null) {
    //     //console.log("req.session.mappingObj :" + JSON.stringify(req.session.mappingObj));        
    var mapUser = req.session.mappingObj;
    delete req.session.mappingObj;
    //     console.log("mapping found");
    //     passportauth.mapGoogleUser(req.user, mapUser).then(function(results) {
    //         // console.log("mapGoogleUser results:" + JSON.stringify(results));
    //         if (results != "") {
    //             console.log("data not null, mapUser:" + JSON.stringify(mapUser));
    //             console.log("mapUser.pageURL:" + mapUser.pageURL);
    //         } else
    //             console.log("data null");
    //         res.redirect(mapUser.pageURL || '/');
    //     }).catch(function(error) {
    //         console.log("mapGoogleUser ,error:" + error);
    //         res.redirect(req.session.redirectUrl || '/');
    //         //  reject("");
    //     });

    // } else {
    // console.log("mapping not found");
    passportauth.validateGoogleUser(req.user, mapUser).then(function(results) {
        if (results != "") {
            req.session.user = results;
            if (mapUser != null)
                req.flash("success", "Your account have been successfully map with your google account. Now you can login through your gmail email id and currect account password ..Enjoy blogging..");
            console.log("validateGoogleUser success");
        } else {
            if (mapUser != null)
                req.flash("error", "Error to map your current account with google account , Kindly try after some time");
            console.log("validateGoogleUser not success");
        }


        var path = mapUser != null ? mapUser.pageURL : req.session.redirectUrl;
        res.redirect(path || '/');
    }).catch(function(error) {
        console.log("Error in inseration Google user in db ,error:" + error);
        res.redirect(req.session.redirectUrl || '/');
    });
    // }
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile", "email"] }));

router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/'
}));
router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});