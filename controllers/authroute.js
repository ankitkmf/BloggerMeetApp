var express = require("express");
var passport = require("passport");
var router = express.Router();
module.exports = router;

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
    res.redirect(req.session.redirectUrl || '/');
    // delete req.session.returnTo;
});

router.get("/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] }));

router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: '/',
    failureRedirect: '/'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});