var express = require("express");
var router = express.Router();
module.exports = router;
var log = require("../modellayer/log");
var _ = require("lodash");
var verifyemail = require('../modellayer/verifyemail');
var config = require("config");
var nodemailer = require('nodemailer');
var formidable = require('formidable');

router.get('/', function(req, res) {
    var userid = req.query.i;
    verifyemail.verifyemail(userid).then(function(results) {
        console.log("1 " + results.data.state);
        var data = { state: results.data.state };
        res.render('emailverified', { layout: 'default', title: 'Email Verification Page', state: data });
    }).catch(function(err) {
        var data = { state: "0" };
        res.render('emailverified', { layout: 'default', title: 'Email Verification Page', state: data });
        //res.status(500).send();
    });
});

router.post('/triggeremail', function(req, res) {
    if (req.url == '/triggeremail') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.hnduserid;
            var emailid = fields.hndemailid;

            var service = config.get("nodeMailer.service");
            var uid = config.get("nodeMailer.user");
            var pwd = config.get("nodeMailer.pass");

            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
                service: service,
                auth: {
                    user: uid,
                    pass: pwd
                }
            });

            var DT = new Date().toISOString();
            path = config.get("app.webserver.protocol") + "://" +
                config.get("app.webserver.host") + ":" +
                config.get("app.webserver.port") + "/verifyemail?i=" +
                userid + "&ts=" + DT;

            var mailOptions = {
                from: uid,
                to: emailid,
                subject: 'Verify email id',
                text: "Please click here to verify email " + path
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("mail sent error: " + error);
                    res.json(false);
                } else {
                    console.log("mail sent success");

                    verifyemail.triggerverificationemail(userid, DT).then(function(results) {
                        res.json(true);
                    }).catch(function(err) {
                        res.json({ "Error": "verifyemailtrigger api error" });
                    });

                    // let path = serviceURL + "/verifyemailtrigger/";
                    // console.log("path:" + path);

                    // var data = {
                    //     "userid": userid,
                    //     "dt": DT
                    // };

                    // axios.post(path, data)
                    //     .then(function(response) {
                    //         console.log("api response:" + response);
                    //         res.json(true);
                    //     })
                    //     .catch(function(error) {
                    //         console.log("api error:" + error);
                    //         res.json({ "Error": "verifyemailtrigger api error" });
                    //     });

                    // Track email verification trigger in Database
                    //var filter = { "userid": userid };

                    // db.findOne('verifyemailtrigger', filter).then(function(results) {
                    //     if (results != undefined && results._id != undefined) {

                    //         filter = { "_id": ObjectId(results._id) };

                    //         var updateQuery = {
                    //             "dt": DT
                    //         };

                    //         db.get().collection("verifyemailtrigger").update(filter, {
                    //             $set: updateQuery
                    //         }, { upsert: false }, (err, results) => {
                    //             if (err) {
                    //                 res.json(false);
                    //             } else {
                    //                 console.log("details updated Successfully");
                    //                 res.json(true);
                    //             }
                    //         });
                    //     } else {
                    //         filter = {
                    //             "userid": userid,
                    //             "dt": DT
                    //         };

                    //         db.Insert("verifyemailtrigger", filter).then(function(results) {
                    //             res.json(true);
                    //         }).catch(function(err) {
                    //             res.json(false);
                    //         });
                    //     }
                    // }).catch(function(e) {
                    //     res.json(false);
                    // });
                }
            });
        });
    }
    return;
});