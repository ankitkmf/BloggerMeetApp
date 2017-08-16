"use strict";
var express = require("express");
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");
var _ = require("lodash");

router.post("/data/signUp", function(req, res) {
    console.log("signup body:" + req.body);
    var isValid = (req.body != null && req.body != undefined && req.body.username != "" && req.body.name != "" && req.body.email != "" && req.body.password != "");
    if (isValid) {
        let path = serviceURL + "/saveSignUp/";
        console.log("path:" + path);

        var result = {
            "username": req.body.username,
            "name": req.body.name,
            "email": req.body.email,
            "password": bcrypt.hashSync(req.body.password, 10),
        };

        axios.post(path, result)
            .then(function(response) {
                console.log("api response:" + response);
                res.json(true);
            })
            .catch(function(error) {
                console.log("api error:" + error);
                res.json({ "Error": "signUp api error" });
            });
    } else {
        res.json({ "Error": "data not define" });
    }

});

router.post("/data/getblog", function(req, res) {
    var data = {};
    var blogs = {};
    var blog = require("./blogs");

    var si = req.body.si;
    var ct = req.body.ct;

    blog.blogs(si, ct).then(function(response) {
        blogs = response.data;

        var nextIndex = 0;
        _.forEach(blogs.result, function(result) {
            nextIndex = result.index
        });

        console.log("nextIndex " + nextIndex);

        var data = { "index": nextIndex, "blogs": blogs };

        res.json(data);
    }).catch(function(err) {
        console.log(err);
        blogs = { "result": [], "count": 0 };
        data = { "index": si, "blogs": blogs };

        res.json(data);
    });
});

router.get('/subscribe', function(req, res) {

    var service = config.get("nodeMailer.service");
    var uid = config.get("nodeMailer.user");
    var pwd = config.get("nodeMailer.pass");

    var path = "Thanks for subscribing !! " + req.body.name;
    var mailOptions = {
        from: uid,
        to: req.body.emailID,
        subject: 'Subscribe user for node app',
        text: path
    };

    //console.log("name: " + req.query.name + " , emailID : " + req.query.emailID + " , dateTime : " + new Date().toDateString());

    var transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: uid,
            pass: pwd
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("error");
            res.json(false);
        } else {
            console.log("success");
            //var filter = { "name": req.query.name, "emailID": req.query.emailID, "dateTime": new Date().toDateString() };
            //db.Insert("subscribeUser", filter).then(function(info) {
            res.json(true);
            //}).catch(function(error) {
            //    res.json(false);
            //});
        }
    });
});