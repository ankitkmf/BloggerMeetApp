'use strict'
var express = require("express");
var router = express.Router();
module.exports = router;
var formidable = require('formidable');
var path = require("path");
var mv = require("mv");
var mkdirp = require("mkdirp");

router.get('/:_id', function(req, res) {
    res.render("myprofile", { layout: 'default', title: 'My Profile Page' });
});

//View/Edit user details
router.post('/uploadphoto', function(req, res) {
    console.log("upload data");

    if (req.url == '/uploadphoto') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var user_id = fields._id;
            console.log("user_id " + user_id);

            var oldpath = files.displayImage.path;
            console.log("oldpath : " + oldpath);

            console.log(files.displayImage.name);
            var extn = getFileExtension(files.displayImage.name);
            console.log(extn);

            switch (extn) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                    console.log("ok");
                    var ss = path.join('..', 'profilephoto', user_id.toString());

                    var uploadpath = path.join(__dirname, ss);
                    console.log("upload path " + uploadpath);

                    mkdirp(uploadpath, function(err) {
                        if (err) {
                            throw err;
                        } else {
                            var uploadedfilepath = path.join(uploadpath, user_id + ".jpg");

                            mv(oldpath, uploadedfilepath, function(err) {
                                if (err) {
                                    throw err;
                                }
                                console.log('file moved successfully. File Path : ' + uploadedfilepath);
                                res.json({ "filepath": "/" + user_id + "/" + user_id + ".jpg" });
                            });
                        }
                    });
                    return;
                default:
                    console.log("not ok");
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