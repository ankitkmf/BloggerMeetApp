var express = require("express");
var passport = require("passport");
var router = express.Router();
module.exports = router;

router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
}));

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback", passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));

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