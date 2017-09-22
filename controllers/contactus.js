var express = require("express");
var router = express.Router();
module.exports = router;
var config = require("config");
var _ = require("lodash");
var nodemailer = require('nodemailer');
var contactusreqtype = require("../data/contactusreqtype.json");
var fs = require('fs');
var handlebars = require("handlebars");
var contactus = require("../modellayer/contactus");

router.get('/', function(req, res, next) {
    res.render('contactus', { layout: 'default', title: 'Contact us Page' });
});

//================== Contact us - send query =================
router.post("/sendquery", function(req, res) {

    if (req.url == '/sendquery') {
        var name = req.body.name;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var reqtypekey = req.body.reqtypekey;
        var comment = req.body.comment;

        var isValid = (name != null && email != null && mobile != null && reqtypekey != null && comment != null);

        var reqtypetext = "";
        _.forEach(contactusreqtype, function(result) {
            if (result.key == reqtypekey)
                reqtypetext = result.value;
        });

        //console.log(reqtypetext);

        if (isValid) {
            var service = config.get("nodeMailer.service");
            var uid = config.get("nodeMailer.user");
            var pwd = config.get("nodeMailer.pass");

            var path = "./public/template/contactus.html";

            //console.log(path);

            readHTMLFile(path, function(err, html) {
                if (err) {
                    console.log("readHTMLFile erorr : " + err);
                    log.logger.error("readHTMLFile erorr : " + err);
                    res.json(false);
                } else {
                    var template = handlebars.compile(html);

                    var replacements = {
                        name: name,
                        comment: comment,
                        mobile: mobile
                    };

                    var htmlToSend = template(replacements);
                    //console.log(htmlToSend);

                    var mailOptions = {
                        from: email,
                        to: uid,
                        subject: 'Contact us - ' + reqtypetext,
                        html: htmlToSend
                    };

                    var transporter = nodemailer.createTransport({
                        service: service,
                        auth: {
                            user: uid,
                            pass: pwd
                        }
                    });

                    transporter.sendMail(mailOptions, function(error, response) {
                        if (error) {
                            console.log("error");
                            res.json(false);
                        } else {
                            console.log("success");

                            var data = {
                                "name": name,
                                "email": email,
                                "mobile": mobile,
                                "reqtypekey": reqtypekey,
                                "comment": comment
                            }

                            contactus.savequery(data).then(function(response) {
                                console.log("contact us savequery api response:" + response);
                                res.json(true);

                            }).catch(function(err) {
                                console.log("api error:" + err);
                                res.json(false);
                            });
                        }
                    });
                }
            });
        } else {
            log.logger.error("Contact us : sendquery call : error : data not define");
            res.json({ "Error": "data not define" });
        }
    }
    return;
});

var readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};