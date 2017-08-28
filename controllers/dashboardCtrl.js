var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/dashboard", function(req, res) {
    res.render('dashboard', { layout: 'default', title: 'Dashboard Page' });
});