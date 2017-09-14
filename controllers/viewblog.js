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

    //console.log("blog : " + blogid);

    var collectionCountList = {};

    Promise.all([
        blogger.getblogbyblogid(blogid),
        blogger.getblogcommentbyblogid(blogid, "0"),
        blogger.viewrecentblogs()
    ]).then(data => {
        var blog = data[0].data;
        var comments = data[1].data;
        var mostrecentblogs = data[2].data;
        var topvisit = { "result": [], "count": 0 };

        var lastCommentId = "0";
        _.forEach(comments.result, function(result) {
            //console.log(1);
            lastCommentId = result._id;
        });

        log.logger.info("Successfully retrive blog's data");

        res.render("viewblog", {
            layout: 'default',
            title: 'View Blog Page',
            blog: blog.result,
            comments: comments,
            mostrecentblogs: mostrecentblogs,
            topvisit: topvisit,
            lastCommentId: lastCommentId
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
        var blogtopic = req.body.blogtopic;

        var isValid = (blogcomment != null);

        if (isValid) {
            var data = {
                "comment": blogcomment,
                "blogid": blogid,
                "username": username,
                "userid": userid,
                "blogtopic": blogtopic
            }

            //console.log("add comment " + JSON.stringify(data));

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
});

//Retrieve Blog specific Comments 
router.get('/getcomments/:blogid/:lastcommentid', function(req, res) {

    var blogid = req.params.blogid;
    var lcid = req.params.lastcommentid;
    var lastCommentId = "0";

    var data = { "comments": [], "count": 0, "lastCommentId": "0" };

    blogger.getblogcommentbyblogid(blogid, lcid).then(function(results) {
        if (results != null)

            _.forEach(results.data.result, function(result) {
            lastCommentId = result._id;
        });

        data = { "result": results.data.result, "count": results.data.count, "lastCommentId": lastCommentId };

        res.json(data);
    }).catch(function(err) {

        console.log(err);
        res.json(data);

    });
    return;
});

//Retrieve Blog list by user id 
router.get('/GetBlogListByUserid/:userid', function(req, res) {

    var userid = req.params.userid;

    var data = { "blogs": [], "count": 0 };

    blogger.GetBlogListByUserid(userid).then(function(results) {
        if (results != null)

            data = { "result": results.data.result, "count": results.data.count };

        res.json(data);
    }).catch(function(err) {

        console.log(err);
        res.json(data);

    });
    return;
});

//Retrieve Blog history by user id 
// router.get('/GetBlogHistoryuserid/:userid/:lastbloghistoryid', function(req, res) {

//     var userid = req.params.userid;
//     var lbhid = req.params.lastbloghistoryid;
//     var lastbloghistoryid = "0";

//     var data = { "bloghistory": [], "count": 0, "lastbloghistoryid": "0" };

//     blogger.GetBlogHistoryuserid(userid, lbhid).then(function(results) {
//         if (results != null)

//             _.forEach(results.data.result, function(result) {
//             lastbloghistoryid = result._id;
//         });

//         data = { "result": results.data.result, "count": results.data.count, "lastbloghistoryid": lastbloghistoryid };

//         res.json(data);
//     }).catch(function(err) {

//         console.log(err);
//         res.json(data);

//     });
//     return;
// });

router.get('/GetBlogHistoryByBlogID/:userid/:selectedBlogID', function(req, res) {

    var userid = req.params.userid;
    var blogid = req.params.selectedBlogID;

    var data = { "result": [], "count": 0 };

    blogger.GetBlogHistoryByBlogID(userid, blogid).then(function(results) {
        if (results != null)

            data = { "result": results.data.result, "count": results.data.count };

        res.json(data);
    }).catch(function(err) {

        console.log(err);
        res.json(data);

    });
    return;
});

router.get('/GetCommentByBlogID/:selectedBlogID', function(req, res) {

    var blogid = req.params.selectedBlogID;

    var data = { "result": [], "count": 0 };

    blogger.GetCommentByBlogID(blogid).then(function(results) {
        if (results != null)

            data = { "result": results.data.result, "count": results.data.count };

        res.json(data);
    }).catch(function(err) {

        console.log(err);
        res.json(data);

    });
    return;
});