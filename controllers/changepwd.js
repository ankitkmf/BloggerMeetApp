var express = require("express");
var router = express.Router();

module.exports = router;

router.get("/changepwd/:id", function(req, res) {
    res.render('changepwd', { layout: 'default', title: 'changepwd Page' });
});