var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/userregistration", function(req, res) {
    res.render('userRegistration', { layout: 'default', title: 'Sign-up Page' });
});