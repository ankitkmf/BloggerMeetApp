"use strict";
var express = require("express");
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
var uniqid = require('uniqid');
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");
var _ = require("lodash");
var nodemailer = require('nodemailer');
var changePwd = require("../modellayer/changepwdmodel");
var dashbordModel = require("../modellayer/dashboardModel");
var log = require("./log");

// save user information 
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
            "authType": "local",
            "profileID": uniqid()
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

    //console.log("name: " + req.query.name + " , emailID : " + req.query.emailID + " , dateTime : " + new Date().toDateString());

    var path = "Thanks for subscribing !! " + req.query.name;
    var mailOptions = {
        from: uid,
        to: req.query.emailID,
        subject: 'Subscribe user for node app',
        text: path
    };

    var transporter = nodemailer.createTransport({
        service: service,
        auth: {
            user: uid,
            pass: pwd
        }
    });

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("sendMail error");
            res.json(false);
        } else {
            console.log("success");
            let path = serviceURL + "/updatesubscribe/";
            console.log("path:" + path);

            var data = {
                "name": req.query.name,
                "emailID": req.query.emailID
            };

            axios.post(path, data)
                .then(function(response) {
                    console.log("api response:" + response);
                    res.json(true);
                })
                .catch(function(error) {
                    console.log("api error:" + error);
                    res.json({ "Error": "updatesubscribe api error" });
                });
        }
    });
});

// valdidate user & send passsword reset mail to user
router.post('/data/fpwd', function(req, res) {
    console.log("step 1.1");
    var service = config.get("nodeMailer.service");
    var uid = config.get("nodeMailer.user");
    var pwd = config.get("nodeMailer.pass");
    let path = serviceURL + "/validateUserEmail/";
    var result = {
        "email": req.body.email,
    };
    axios.post(path, result)
        .then(function(response) {
            if (response.data != null && response.data.count > 0) {
                path = config.get("nodeMailer.path") + "/auth/changepwd/" + response.data.result[0]._id;
                console.log("validateUserEmail api response:" + path);
                var mailOptions = {
                    from: uid,
                    to: req.body.email,
                    subject: 'Blogger app reset password alert!',
                    text: path
                };
                var transporter = nodemailer.createTransport({
                    service: service,
                    auth: {
                        user: uid,
                        pass: pwd
                    }
                });
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log("sendMail error");
                        res.json(false);
                    } else {
                        console.log("Send fpwd success");
                        res.json(true);
                    }
                });
            } else
                res.json(false);
        })
        .catch(function(error) {
            console.log("validateUserEmail api error:" + error);
            res.json({ "Error": "validateUserEmail api error" });
        });
});

//validate user pwd for reseting passsword
router.post('/data/ValidateUserPwd', function(req, res, next) {
    if (req.body.id != null && req.body.cupwd != null && req.body.npwd != null) {
        changePwd.findUser(req.body.id).then((response) => {
                console.log("common=>ValidateUserPwd=>findUser step 1.1," + JSON.stringify(response.result));
                return changePwd.validatePassword(response.result.password, req.body.cupwd);
                // console.log("ValidateUserPwd common step 1.3.1,req.body.cupwd:" + req.body.cupwd);
                // console.log("ValidateUserPwd common step 1.3.1,req.body.npwd:" + req.body.npwd);
                // if (response != null && response.result != null) {
                //     console.log("ValidateUserPwd common step 1.4,pwd:" + response.result.password);

                //     bcrypt.compare(req.body.cupwd, response.result.password, function(err, res) {
                //         if (res) {
                //             console.log("ValidateUserPwd common step 1.5, pwd match");
                //             return changePwd.updatePassword(req.body.id, req.body.npwd);
                //         } else {
                //             console.log("ValidateUserPwd common step 1.6, pwd not match");
                //             //  res.json(false);
                //             next();
                //         }
                //     });
                //return changePwd.updatePassword(req.body.id, req.body.npwd);
                // } else {
                //     console.log("ValidateUserPwd common step 1.7, null respone");
                //     next();
                //     // res.json(false);
                // }
            }).then((response) => {
                console.log("common=>ValidateUserPwd=>validatePassword step 1.1," + JSON.stringify(response.result));
                return changePwd.updatePassword(req.body.id, req.body.npwd);
                // res.json(true);
            }).then((response) => {
                console.log("common=>ValidateUserPwd=>updatePassword step 1.1," + JSON.stringify(response.result));
                // return changePwd.updatePassword(req.body.id, req.body.npwd);
                res.json(true);
            })
            .catch(function(err) {
                console.log("ValidateUserPwd common step 1.9:" + err);
                res.json(false);
                // res.render('changepwd', { layout: 'default', title: 'changepwd Page', isValidReq: false });
            });
    } else {
        console.log("ValidateUserPwd common step 1.10");
        res.json(false);
    }
});

router.get("/data/countries", function(req, res) {
    res.json(require("../data/countries.json"));
});

router.get("/data/usergraph", function(req, res) {
    dashbordModel.GetUserGraph().then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("err:" + err);
        res.json(false);
    });
});

router.get("/data/userBlogs", function(req, res) {
    dashbordModel.GetUserBlogs().then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("err:" + err);
        res.json(false);
    });
});

router.get("/data/userComments", function(req, res) {
    dashbordModel.GetUserComments().then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("err:" + err);
        res.json(false);
    });
});

router.get("/data/userInfo", function(req, res) {
    dashbordModel.GetuserInfo().then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("err:" + err);
        res.json(false);
    });
});