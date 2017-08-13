var express = require("express");
var passport = require("passport");
var router = express.Router();
module.exports = router;

router.get("/login", function(req, res) {
    res.render('login'); //, { title: 'Login Page' });
});

router.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});