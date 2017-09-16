var express = require("express");
var passport = require("passport");
var passportauth = require("../modellayer/passportauth");
var axios = require("axios");
var log = require("../modellayer/log");
var config = require("config");
var bcrypt = require('bcrypt');
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

// router.post("/login", passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/'
// }));

router.post('/login', passport.authenticate('local'), function(req, res) {
    // console.log("++++In login post:" + req.session.redirectUrl);
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
    console.log("Google User:" + JSON.stringify(req.user));
    if (req.session.mappingObj != null) {
        // console.log("req.session.mappingObj :" + JSON.stringify(req.session.mappingObj));
        //req.session.mappingObj = "";
        delete req.session.mappingObj;
        console.log("mapping found");
        res.redirect(req.session.redirectUrl || '/');
    } else {
        console.log("mapping not found");
        validateGoogleUser(req.user).then(function(results) {
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

let validateGoogleUser = (googleUser) => {
    return new Promise(function(resolve, reject) {
        if (googleUser.email != null && googleUser.id != null) {
            passportauth.find(googleUser.email).then((response) => {
                if (response != null && response.data != null && response.data.result.count > 0) {
                    var user = {};
                    user = response.data.result.result;
                    //console.log(JSON.stringify(user));
                    console.log("Google user found in DB");
                    resolve(user); //done(null, user);
                } else {
                    console.log("Google user doesn't found");
                    let path = serviceURL + "/saveSignUp/";
                    var user = {
                        "id": googleUser.id,
                        "username": googleUser.username,
                        "userImage": googleUser.userImage != null ? googleUser.userImage : "",
                        "authType": "google"
                    };
                    var result = {
                        "username": googleUser.username,
                        "name": googleUser.username,
                        "googlename": googleUser.username,
                        "facebookname": "",
                        "localemail": "",
                        "facebookemail": "",
                        "googleemail": googleUser.email,
                        "password": bcrypt.hashSync("test", 10),
                        "authType": "google",
                        "profileID": googleUser.id,
                        "userImage": googleUser.userImage != null ? googleUser.userImage : ""
                    };

                    axios.post(path, result)
                        .then(function(response) {
                            console.log("Google user inserted in db ");
                            //return done(null, user);
                            resolve(user);
                        })
                        .catch(function(error) {
                            console.log("Error in inseration Google user in db ");
                            reject("");
                        });
                }
            }).catch(function(err) {
                console.log("Gooel passport find exception:" + err);
                log.logger.error("Passport Init : passportauth find : User Name : " + googleUser.username + " Error : " + err);
                reject("");
            });
        } else reject("");
    });
};