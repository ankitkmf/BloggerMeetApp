var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/forgotPwd", function(req, res) {
    res.render('forgotPwd', { layout: 'default', title: 'forgot Pwd Page' });
});