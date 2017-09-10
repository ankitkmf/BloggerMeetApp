var express = require("express");
var router = express.Router();
module.exports = router;
var log = require("../modellayer/log");
var _ = require("lodash");
var blogger = require('../modellayer/blogs');

//var categoryList = blogger.category;

//Get Blog details
router.get('/showdetails/:blogid', function(req, res) {
    var blogid = req.params.blogid;

    console.log("blog : " + blogid);

    var collectionCountList = {};

    Promise.all([
        blogger.getblogbyblogid(blogid),
        blogger.getblogcommentbyblogid(blogid, 0),
        blogger.viewrecentblogs()
    ]).then(data => {
        var blog = data[0].data;
        var comments = data[1].data;
        var mostrecentblogs = data[2].data;
        var topvisit = { "result": [], "count": 0 };

        log.logger.info("Successfully retrive blog's data");

        console.log("blog : " + JSON.stringify(blog));
        console.log("comments : " + JSON.stringify(comments));
        console.log("mostrecentblogs : " + JSON.stringify(mostrecentblogs));

        res.render("viewblog", {
            layout: 'default',
            title: 'View Blog Page',
            blog: blog.result,
            comments: comments,
            mostrecentblogs: mostrecentblogs,
            topvisit: topvisit
        });

    }).catch(function(err) {
        log.logger.error("Error while retieveing blog's data. Error " + err);
        res.status(500).send();
    });

});

//Add Blog Comments details
router.post('/addcomment', function(req, res) {

    if (req.url == '/addcomment') {
        var blogcomment = req.body.blogcomment;
        var blogid = req.body.blogid;
        var username = req.body.username;
        var userid = req.body.userid;

        var isValid = (blogcomment != null);

        if (isValid) {
            var data = {
                "comment": blogcomment,
                "blogid": blogid,
                "username": username,
                "userid": userid
            }

            console.log("add comment " + JSON.stringify(data));

            blogger.addcomment(data).then(function(results) {

                //console.log("add comment " + JSON.stringify(results));
                res.json(true);

            }).catch(function(err) {

                console.log(err);
                res.json(false);

            });

        } else {
            log.logger.error("Model layer blogs : updateaboutme call : error : data not define");
            res.json({ "Error": "data not define" });
        }
    }
    return;


    // var id = req.body._id;

    // db.get().collection("comments").save({
    //     "blog_id": id,
    //     "addedby": req.body.addedby,
    //     "blogcomment": req.body.blogcomment,
    //     "IsApproved": false,
    //     "date": new Date().toUTCString()
    // }, (err, results) => {
    //     if (err) {
    //         res.status(500).send();
    //     } else {
    //         //  console.log("Blog Comments Saved Successfully");

    //         getblogdetails(id, res);
    //     }
    // });
});

//Retrieve Blog specific Comments 
router.get('/getcomments/:blogid/:startindex', function(req, res) {

    var blogid = req.params.blogid;
    var si = req.params.startindex;

    console.log("blog : " + blogid);

    var data = { "result": [], "count": 0 };

    blogger.getblogcommentbyblogid(blogid, si).then(function(results) {


        if (results != null)
            data = { "result": results, "count": 0 };

        console.log("comments " + data);
        res.json(data);
    }).catch(function(err) {

        console.log(err);
        res.json(data);

    });
    return;
});