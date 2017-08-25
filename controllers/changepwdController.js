var express = require("express");
var router = express.Router();
var changePwd = require("../modellayer/changepwdmodel");

module.exports = router;

router.get("/changepwd/:id", function(req, res) {
    //http://localhost:2000/auth/changepwd/5945424df36d28265550c8ea   
    changePwd.findUser(req.params.id).then((response) => {
        //console.log(JSON.stringify(response))
        if (response != null && response.result != null) {
            res.render('changepwd', { layout: 'default', title: 'changepwd Page', isValidReq: true, userID: req.params.id });
        } else {
            res.render('changepwd', { layout: 'default', title: 'changepwd Page', isValidReq: false });
        }
    }).catch(function(err) {
        res.render('changepwd', { layout: 'default', title: 'changepwd Page', isValidReq: false });
    });
});