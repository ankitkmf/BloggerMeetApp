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
        //console.log("path:" + path);

        var result = {
            "username": req.body.username,
            "name": req.body.name,
            "email": req.body.email,
            "googlename": "",
            "facebookname": "",
            "googleemail": "",
            "facebookemail": "",
            "password": bcrypt.hashSync(req.body.password, 10),
            "authType": "local",
            "userImage": "",
            "dateTime": new Date().toDateString()
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

    var lbid = req.body.lbid;
    var ct = req.body.ct;

    blog.blogs(lbid, ct).then(function(response) {
        blogs = response.data;

        var lastblogid = 0;
        _.forEach(blogs.result, function(result) {
            lastblogid = result._id
        });

        console.log("lastblogid " + lastblogid);

        var data = { "lastblogid": lastblogid, "blogs": blogs };

        res.json(data);
    }).catch(function(err) {
        console.log(err);
        blogs = { "result": [], "count": 0 };
        data = { "lastblogid": lbid, "blogs": blogs };

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
            //console.log("path:" + path);

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
    var emailid = req.body.email;
    let path = serviceURL + "/validateUserOnReset/";
    var result = {
        "email": emailid,
    };

    console.log("2 " + path + " , " + emailid);

    axios.post(path, result)
        .then(function(response) {
            console.log("3 " + response.data.result.count);
            if (response != null && response.data.result != null && response.data.result.count > 0) {
                console.log("4");
                var DT = new Date().toISOString();
                var userid = response.data.result.result._id;
                path = config.get("nodeMailer.path") + "/auth/resetpwd?i=" +
                    userid + "&ts=" + DT;
                console.log("validateUserOnReset api response:" + path);
                var mailOptions = {
                    from: uid,
                    to: emailid,
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

                        changePwd.triggerfpwdemail(userid, DT).then(function(results) {
                            res.json(true);
                        }).catch(function(err) {
                            res.json({ "Error": "Forgot password email trigger api error" });
                        });

                        res.json(true);
                    }
                });
            } else
                res.json(false);
        })
        .catch(function(error) {
            console.log("validateUserOnReset api error:" + error);
            res.json({ "Error": "validateUserOnReset api error" });
        });
});

// valdidate user & send passsword reset mail to user
router.post('/data/checkUserEmail', function(req, res) {
    console.log("checkUserEmail 1");
    var email = req.body.email;
    let path = serviceURL + "/validateUserEmail/" + email;

    axios.get(path)
        .then(function(response) {
            console.log("checkUserEmail 2");
            if (response.data != null && response.data.result.count > 0) {
                console.log("checkUserEmail 3:response.data.count:" + response.data.result.count);
                res.json(false);
                // if (error) {
                //     console.log("checkUserEmail 3");
                //     res.json(false);
                // } else {
                //     console.log("checkUserEmail 4");
                //     res.json(true);
                // }
            } else {
                console.log("checkUserEmail 5");
                res.json(true);
            }
        })
        .catch(function(error) {
            console.log("checkUserEmail 6:" + error);
            res.json(false);
            // res.json({ "Error": "validateUserEmail api error" });
        });
});

// valdidate username during signup
router.post('/data/checkUserName', function(req, res) {
    console.log("checkUserName 1");
    var username = req.body.username;
    let path = serviceURL + "/checkUserName/" + username;

    axios.get(path)
        .then(function(response) {
            console.log("checkUserName 2 " + JSON.stringify(response.data.result));
            if (response.data != null && response.data.result) {
                res.json(false);
            } else {
                console.log("checkUserName 5");
                res.json(true);
            }
        })
        .catch(function(error) {
            console.log("checkUserName 6:" + error);
            res.json(false);
            // res.json({ "Error": "validateUserEmail api error" });
        });
});

//validate user pwd for reseting passsword
router.post('/data/ValidateUserPwd', function(req, res, next) {
    if (req.body.userid != null && req.body.cupwd != null && req.body.npwd != null) {

        var userid = req.body.userid;
        var cupwd = req.body.cupwd;
        var npwd = req.body.npwd;

        console.log("ValidateUserPwd " + userid + " ," + cupwd + " , " + npwd);

        changePwd.findUser(userid).then((response) => {
                console.log("2 " + response.data.result.result.password);
                return changePwd.validatePassword(response.data.result.result.password, cupwd);
            }).then((response) => {
                console.log("12");
                return changePwd.updatePassword(userid, npwd);
            }).then((response) => {
                console.log("112");
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

router.get("/data/userBlogs/:type/:id", function(req, res) {
    dashbordModel.GetUserBlogs(req.params.type, req.params.id).then(data => {
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

router.get("/data/userComments/:type/:id", function(req, res) {
    dashbordModel.GetUserComments(req.params.type, req.params.id).then(data => {
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

router.get("/data/userInfo/:type/:id", function(req, res) {
    dashbordModel.GetuserInfo(req.params.type, req.params.id).then(data => {
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

router.get("/data/userDatatable/:type", function(req, res) {
    var type = req.params.type;
    dashbordModel.GetUserTableData(type).then(data => {
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

router.get("/data/userBlogDatatable/:type", function(req, res) {
    var type = req.params.type;
    console.log("Step:1");
    dashbordModel.GetUserBlogTableData(type).then(data => {
        if (data != null) {
            console.log("Step:2");
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("err:" + err);
        res.json(false);
    });
});

router.post("/data/updateTableRecords", function(req, res) {
    console.log("Step 1")
    if (req.body.id != null) {
        let path = serviceURL + "/updateUsersRecord/";
        console.log("Step 2");
        var result = {
            "id": req.body.id,
            "IsEmailVerified": (req.body.email === 'true'),
            "active": (req.body.active === 'true'),
            "admin": (req.body.admin === 'true')
        };
        // console.log("UpdateTableRecords collection:" + JSON.stringify(result));
        axios.post(path, result)
            .then(function(response) {
                //  console.log("updateUsersRecord api response:" + response);
                res.json(true);
            })
            .catch(function(error) {
                console.log(" updateUsersRecord api error:" + error);
                res.json({ "Error": "signUp api error" });
            });
    } else
        res.json(false);
});

router.post("/data/updateBlogTableRecords", function(req, res) {
    if (req.body.id != null && req.body.type != null) {
        let path = serviceURL + "/updateBlogTableRecords/";
        var type = "";
        switch (req.body.type) {
            case "approve":
                type = "1";
                break;
            case "reject":
                type = "2";
                break;
            case "pending":
                type = "0";
                break;
            default:
                type = "0";
        }
        var result = {
            "id": req.body.id,
            "type": type
        };
        console.log("updateBlogTableRecords collection:" + JSON.stringify(result));
        axios.post(path, result)
            .then(function(response) {
                console.log("updateBlogTableRecords api response:" + response);
                res.json(true);
            })
            .catch(function(error) {
                console.log(" updateBlogTableRecords api error:" + error);
                res.json({ "Error": "signUp api error" });
            });
    } else
        res.json(false);
});


router.get("/data/GetUserSerach", function(req, res) {
    dashbordModel.GetUserSerach().then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("GetUserSerach1 err:" + err);
        res.json(false);
    });
});

router.get("/data/GetUserHistory/:type/:id", function(req, res) {
    //console.log("GetUserHistory 1" + req.params.type);
    dashbordModel.GetUserHistory(req.params.type, req.params.id).then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.json(false);
        }
    }).catch(function(err) {
        console.log("GetUserHistory1 err:" + err);
        res.json(false);
    });
});

//Reset user pwd on forgot
router.post('/data/ResetUserPwd', function(req, res, next) {
    if (req.body._id != null && req.body.npwd != null) {
        changePwd.vaidateURL(req.body._id).then((response) => {

                return changePwd.findUser(req.body._id);

            }).then((response) => {
                var userid = response.data.result.result._id;
                return changePwd.updatePassword(userid, req.body.npwd);
            }).then((response) => {
                console.log("success");
                res.json(true);
            })
            .catch(function(err) {
                console.log("ResetUserPwd common step 1.9:" + err);
                res.json(false);
                // res.render('changepwd', { layout: 'default', title: 'changepwd Page', isValidReq: false });
            });
    } else {
        console.log("ResetUserPwd common step 1.10");
        res.json(false);
    }
});