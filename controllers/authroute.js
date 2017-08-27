var express = require("express");
var passport = require("passport");
var router = express.Router();
module.exports = router;

// router.get("/login", function(req, res) {
//     res.render('login'); //, { title: 'Login Page' });
// });

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

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});