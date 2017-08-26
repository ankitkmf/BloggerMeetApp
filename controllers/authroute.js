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
//passport.authenticate('google', { scope: ['profile'] }));

// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: '/forgotPwd' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

router.get("/google/callback", passport.authenticate('google', {
    successRedirect: '/auth/forgotPwd',
    failureRedirect: '/'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Login endpoint
// router.post('/login', function(req, res) {
//     if (!req.body.Email || !req.body.password) {
//         res.send('login failed');
//     } else if (req.query.username === "amy" || req.query.password === "amyspassword") {
//         req.session.user = "amy";
//         req.session.admin = true;
//         res.send("login success!");
//     }
// });