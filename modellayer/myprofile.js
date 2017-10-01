"use strict";
var express = require("express");
var router = express.Router();
module.exports = router;
var axios = require("axios");
var config = require("config");
var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");
var formidable = require('formidable');
var path = require("path");
var mv = require("mv");
var mkdirp = require("mkdirp");
var nodemailer = require('nodemailer');
//var _ = require("lodash");

let getaboutme = function(userid) {
    let path = serviceURL + "/getaboutme/" + userid;
    //console.log("path:" + path);
    log.logger.info("Model layer getaboutme method : service call : " + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer getaboutme method : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer getaboutme method : service call : error : " + error);
                reject(err);
            });
    });
}

let getpersonaldetails = function(userid) {
    let path = serviceURL + "/getpersonaldetails/" + userid;
    // console.log("path:" + path);
    log.logger.info("Model layer getpersonaldetails method : service call : " + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer getpersonaldetails method : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer getpersonaldetails method : service call : error : " + error);
                reject(err);
            });
    });
}

let getproffessionaldetails = function(userid) {
    let path = serviceURL + "/getproffessionaldetails/" + userid;
    //console.log("path:" + path);
    log.logger.info("Model layer getproffessionaldetails method : service call : " + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer getproffessionaldetails method : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer getproffessionaldetails method : service call : error : " + error);
                reject(err);
            });
    });
}

// let getbloghistoryuserid = function(userid, lastbloghistoryid) {
//     let path = serviceURL + "/getbloghistoryuserid/" + userid + "/" + lastbloghistoryid;
//     console.log("path:" + path);
//     log.logger.info("Model layer : getbloghistoryuserid : service call : " + path);
//     //console.log("getblogcommentbyblogid 1114");
//     return new Promise(function(resolve, reject) {
//         axios.get(path).then(function(response) {
//                 //console.log("getblogcommentbyblogid 21");
//                 log.logger.info("Model layer : getbloghistoryuserid : service call : success");
//                 resolve(response);
//             })
//             .catch(function(error) {
//                 //console.log("getblogcommentbyblogid 31");
//                 var err = { "Error": error };
//                 log.logger.error("Model layer : getbloghistoryuserid : service call : error : " + error);
//                 reject(err);
//             });
//     });
// }

let updateprofilephotopath = (userid, profilepath) => {
    let path = serviceURL + "/updateprofilephotopath/";
    //console.log("path:" + path);

    var data = {
        "userid": userid,
        "localphoto": profilepath
    };

    axios.post(path, data)
        .then(function(response) {
            log.logger.info("Model layer updateprofilephotopath method : service call : success");
            //res.json(true);
        })
        .catch(function(error) {
            console.log("api error:" + error);
            log.logger.error("Model layer blogs : updateprofilephotopath call : error : " + error);
            //res.json({ "Error": "updateprofilephotopath api error" });
        });
}

router.post('/updateaboutme', function(req, res) {

    if (req.url == '/updateaboutme') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var data = fields.aboutme;
            var id = fields._id;
            var filter = "";

            var isValid = (userid != null && data != null);
            if (isValid) {
                let path = serviceURL + "/updateaboutme/";
                //console.log("path:" + path);

                var data = {
                    "userid": userid,
                    "data": data,
                    "_id": id
                };

                axios.post(path, data)
                    .then(function(response) {
                        console.log("api response:" + response);
                        log.logger.info("Model layer updateaboutme method : service call : success");
                        res.json(true);
                    })
                    .catch(function(error) {
                        console.log("api error:" + error);
                        log.logger.error("Model layer blogs : updateaboutme call : error : " + error);
                        res.json({ "Error": "updateaboutme api error" });
                    });
            } else {
                log.logger.error("Model layer blogs : updateaboutme call : error : data not define");
                res.json({ "Error": "data not define" });
            }
        });
    }

    return;
});

router.get('/:_id', function(req, res) {

    var userid = req.params._id;
    // console.log("_id " + userid);
    var collectionCountList = {};

    console.log("req.user" + JSON.stringify(req.user));
    if (userid == req.session.user._id && req.session.user.authType == "local") {
        var mappingObj = {
            "page": "profile",
            "id": userid,
            "username": req.session.user.username,
            "pageURL": "/myprofile/" + userid
        };
        req.session.mappingObj = mappingObj;
        var showGoogleMap = req.user.mapGoogleUser != null ? req.user.mapGoogleUser : "false";
        console.log("showGoogleMap:" + showGoogleMap);
        Promise.all([
            getaboutme(userid),
            getpersonaldetails(userid),
            getproffessionaldetails(userid)

        ]).then(data => {
            var aboutme = data[0].data;
            var personaldetails = data[1].data;
            var proffessionaldetails = data[2].data;
            log.logger.info("Successfully retrive my-profile data");
            res.render("myprofile", {
                layout: 'default',
                title: 'My Profile Page',
                aboutme: aboutme.result,
                showGoogleMap: showGoogleMap,
                personaldetails: personaldetails.result,
                proffessionaldetails: proffessionaldetails.result
            });

        }).catch(function(err) {
            log.logger.error("Error while retieveing my-profile data. Error " + err);
            res.status(500).send();
        });
    } else {
        res.redirect('/');
    }

});

//View/Edit user details
router.post('/uploadphoto', function(req, res) {
    log.logger.info("uploadphoto")

    if (req.url == '/uploadphoto') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var user_id = fields._id;
            var oldpath = files.displayImage.path;
            var extn = getFileExtension(files.displayImage.name);

            log.logger.info("uploadphoto : user_id " + user_id + " : oldpath " + oldpath + " : name : " +
                files.displayImage.name + " : extn : " + extn);

            switch (extn) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    console.log("ok");
                    var ss = path.join('..', 'profilephoto', user_id.toString());

                    var uploadpath = path.join(__dirname, ss);
                    console.log("upload path " + uploadpath);
                    log.logger.info("uploadphoto : upload path " + uploadpath);

                    mkdirp(uploadpath, function(err) {
                        if (err) {
                            throw err;
                        } else {
                            var uploadedfilepath = path.join(uploadpath, user_id + ".jpg");

                            var profilepath = "/" + user_id + "/" + user_id + ".jpg";
                            updateprofilephotopath(user_id, profilepath);

                            mv(oldpath, uploadedfilepath, function(err) {
                                if (err) {
                                    throw err;
                                }
                                console.log('file moved successfully. File Path : ' + uploadedfilepath);
                                log.logger.info("uploadphoto : mv method : file moved successfully. File Path : " + uploadedfilepath);
                                res.json({ "filepath": profilepath });
                            });
                        }
                    });
                    return;
                default:
                    log.logger.info("uploadphoto : error");
                    res.json({ "error": "IFE" });
                    return;
            }

            //var dt = new Date();
            //console.log("dt " + dt);
            //var currentyear = (dt.getUTCFullYear()).toString();
            //var currentmonth = ("0" + (dt.getUTCMonth() + 1)).slice(-2);
            //var currentday = ("0" + (dt.getUTCDate())).slice(-2);
        });

        return;
    }
});

router.post('/updatepersonaldetails', function(req, res) {

    if (req.url == '/updatepersonaldetails') {

        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var fname = fields.inputfirstname;
            var lname = fields.inputlastname;
            var dob = fields.inputDOB;
            var address1 = fields.inputaddress1;
            var address2 = fields.inputaddress2;
            var country = fields.inputcountry;
            var pinno = fields.inputpinno;
            var phone = fields.inputphone;
            var id = fields._id;

            var isValid = (userid != null && fname != null && lname != null);

            if (isValid) {

                let path = serviceURL + "/updatepersonaldetails/";
                //console.log("path:" + path);

                var data = {
                    "userid": userid,
                    "firstname": fname,
                    "lastname": lname,
                    "dob": dob,
                    "address1": address1,
                    "address2": address2,
                    "country": country,
                    "pinno": pinno,
                    "phone": phone,
                    "_id": id
                };

                axios.post(path, data)
                    .then(function(response) {
                        log.logger.info("Model layer updatepersonaldetails method : service call : success");
                        res.json(true);
                    })
                    .catch(function(error) {
                        console.log("api error:" + error);
                        log.logger.error("Model layer blogs : updatepersonaldetails call : error : " + error);
                        res.json({ "Error": "updatepersonaldetails api error" });
                    });
            } else {
                log.logger.error("Model layer blogs : updatepersonaldetails call : Error : data not define");
                res.json({ "Error": "data not define" });
            }
        });
    }
    return;
});

router.post('/updateprofdetails', function(req, res) {
    if (req.url == '/updateprofdetails') {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var userid = fields.userid;
            var proffession = fields.inputproffession;
            var experience = fields.inputexperience;
            var deptname = fields.inputdepartment;
            var companyname = fields.inputcompanyname;
            var compemailid = fields.inputcompemail;
            var compphone = fields.inputcompphone;
            var qualification = fields.inputqualification;
            var educationyear = fields.inputeduyear;
            var location = fields.inputlocation;
            var id = fields._id;

            console.log("updateprofdetails qualification " + qualification);

            var isValid = (userid != null && proffession != null);

            if (isValid) {

                let path = serviceURL + "/updateproffessionaldetails/";
                //console.log("path:" + path);

                var data = {
                    "userid": userid,
                    "proffession": proffession,
                    "experience": experience,
                    "deptname": deptname,
                    "companyname": companyname,
                    "compemailid": compemailid,
                    "compphone": compphone,
                    "qualification": qualification,
                    "educationyear": educationyear,
                    "location": location,
                    "_id": id
                };

                axios.post(path, data)
                    .then(function(response) {
                        log.logger.info("Model layer updateprofdetails method : service call : success");
                        res.json(true);
                    })
                    .catch(function(error) {
                        console.log("api error:" + error);
                        log.logger.error("Model layer blogs : updateprofdetails call : error : " + error);
                        res.json({ "Error": "updateprofdetails api error" });
                    });
            } else {
                log.logger.error("Model layer blogs : updateprofdetails call : Error : data not define");
                res.json({ "Error": "data not define" });
            }
        });
    }
    return;
});

function getFileExtension(filename) {
    // Use a regular expression to trim everything before final dot
    var extension = filename.replace(/^.*\./, '');
    // Iff there is no dot anywhere in filename, we would have extension == filename,
    // so we account for this possibility now
    if (extension == filename) {
        extension = '';
    } else {
        // if there is an extension, we convert to lower case
        // (N.B. this conversion will not effect the value of the extension
        // on the file upload.)
        extension = extension.toLowerCase().trim();
    }
    return extension;
}

router.post("/updatecomment", function(req, res) {
    if (req.body._id != null && req.body.status != null) {

        let path = serviceURL + "/updatecomment/";
        var status = "";
        switch (req.body.status) {
            case "approve":
                status = "1";
                break;
            case "reject":
                status = "2";
                break;
            case "pending":
                status = "0";
                break;
            default:
                status = "0";
        }
        var result = "";
        if (req.body.comment != undefined && req.body.comment != null) {
            result = {
                "comment": req.body.comment,
                "_id": req.body._id,
                "status": status
            };
        } else {
            result = {
                "_id": req.body._id,
                "status": status
            };
        }
        console.log("updatecomment collection:" + JSON.stringify(result));
        axios.post(path, result)
            .then(function(response) {
                console.log("updatecomment api response:" + response);
                res.json(true);
            })
            .catch(function(error) {
                console.log(" updatecomment api error:" + error);
                res.json({ "Error": "signUp api error" });
            });
    } else
        res.json(false);
});