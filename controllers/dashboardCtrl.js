var express = require("express");
var router = express.Router();
var dashbordModel = require("../modellayer/dashboardModel");
module.exports = router;

router.get("/dashboard", function(req, res) {
    dashbordModel.GetAllUserCount().then(data => {
        if (data != null) {
            res.render('dashboard', { layout: 'default', title: 'Dashboard Page', result: data });
        } else
            res.status(500).send();
    }).catch(function(err) {
        console.log("err:" + err);
        res.status(500).send();
    });
});