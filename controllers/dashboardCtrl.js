var express = require("express");
var router = express.Router();
var dashbordModel = require("../modellayer/dashboardModel");
module.exports = router;

router.get("/dashboard/:id?", function(req, res) {
    //http://localhost:2000/auth/dashboard/595cde84f8ce4a2250f38820
    var id = req.params.id != null ? req.params.id.toLowerCase() : "testde84f8ce4a2250f38820";
    console.log("id:" + id);
    dashbordModel.GetAllUserCount(id).then(data => {
        if (data != null) {
            res.render('dashboard', { layout: 'default', title: 'Dashboard Page', result: data });
        } else
            res.status(500).send();
    }).catch(function(err) {
        console.log("err:" + err);
        res.status(500).send();
    });
});