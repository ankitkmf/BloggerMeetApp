var express = require("express");
var router = express.Router();
module.exports = router;
var log = require("../modellayer/log");
var _ = require("lodash");
//var formidable = require('formidable');

//var MongoDB = require("mongodb").MongoClient;
//var ObjectId = require("mongodb").ObjectID;
//var db = require('../models/db');
var blogger = require('../modellayer/blogs');

var categoryList = blogger.category;

//Status 
var status = require('../data/blogstatus.json');

//Get Blog added by an user
router.get('/profile/:_id', function(req, res) {

    //console.log("route 1 " + req.params._id);

    var blogs = {};
    var userid = req.params._id;


    blogger.blogsbyuserid(0, userid).then(function(response) {

        //console.log("route 4 " + req.params._id);

        blogs = response.data;

        log.logger.info("Blogger Page : retrieve blogs : blogs count " + blogs.count);

        //console.log(blogs.result);

        var nextIndex = 0;
        _.forEach(blogs.result, function(result) {
            //console.log(1);
            nextIndex = result.index
        });

        //console.log("Blogger Page : retrieve blogs : blogs count " + blogs.count + " , nextIndex : " + nextIndex);

        if (blogs.count == 0) {
            //blogs = { "result": [], "count": 0 };
            //console.log(blogs.count);
            res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: 0 });
        } else {
            //console.log(blogs.count);
            res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: nextIndex });
        }
    }).catch(function(err) {
        //console.log(err);
        res.status(500).send();
    });
});

router.post('/profile', function(req, res) {

    console.log("route 1 " + req.body.userid);

    var blogs = {};
    var si = req.body.si;
    var userid = req.body.userid;

    //console.log("route 2 " + userid);
    //console.log("route 3 " + JSON.stringify(categoryList));

    blogger.blogsbyuserid(si, userid).then(function(response) {

        console.log("route 4 " + req.body.userid + " , " + req.body.si);

        blogs = response.data;

        log.logger.info("Blogger Page : retrieve blogs : blogs count " + blogs.count);

        //console.log(blogs.result);

        var nextIndex = 0;
        _.forEach(blogs.result, function(result) {
            //console.log(1);
            nextIndex = result.index
        });

        console.log("Blogger Page post : retrieve blogs : blogs count " + blogs.count + " , nextIndex : " + nextIndex);

        var data = {};
        if (blogs.count == 0) {
            blogs = { "result": [], "count": 0 };

            data = { "index": nextIndex, "category": categoryList, "blogs": blogs };


            //console.log(blogs.count);
            //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: 0 });
            res.json(data);
        } else {

            data = { "index": nextIndex, "category": categoryList, "blogs": blogs };
            res.json(data);
            //console.log(blogs.count);
            //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: nextIndex });
        }
    }).catch(function(err) {
        console.log(err);
        blogs = { "result": [], "count": 0 };
        data = { "index": si, "category": categoryList, "blogs": blogs };

        res.json(data);
    });
});


//================== add blog =================
router.post("/savedata/add", function(req, res) {

    if (req.url == '/savedata/add') {
        //var form = new formidable.IncomingForm();
        // form.parse(req, function(err, fields, files) {
        //     console.log("savedata " + fields.topic + " , " + fields.content + " , " + fields.category);
        //     res.json(true);
        // });
        //console.log("savedata/add " + req.body.topic + " , " + req.body.content + " , " + req.body.category);

        var topic = req.body.topic;
        var content = req.body.content;
        var category = req.body.category;
        var userid = req.body.userid;
        var createdby = req.body.createdby;

        var isValid = (topic != null && content != null && category != null && createdby != null && userid != null);

        if (isValid) {
            var data = {
                "topic": topic,
                "content": content,
                "category": category,
                "userid": userid,
                "createdby": createdby
            }

            console.log("add " + JSON.stringify(data));

            blogger.addblog(data).then(function(results) {

                //console.log("savedata/add " + JSON.stringify(data));
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


    // if (req.body._id != undefined && req.body._id != null) {
    //     var id = req.body._id;
    //     var topic = req.body.topic;

    //     db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
    //         if (err) {
    //             res.status(500).send();
    //         } else {
    //             if (info._id != undefined) {
    //                 db.get().collection("blogs").update({ "_id": ObjectId(info._id) }, {
    //                     $set: {
    //                         "topic": req.body.topic,
    //                         "content": req.body.content,
    //                         "categorykey": req.body.category
    //                     }
    //                 }, { upsert: true }, (err, results) => {
    //                     if (err) {
    //                         res.status(500).send();
    //                     } else {
    //                         //  console.log("Blog details updated Successfully");

    //                         //Add update history 
    //                         db.get().collection("bloghistory").save({
    //                             "blog_id": info._id,
    //                             "topic": req.body.topic,
    //                             "content": req.body.content,
    //                             "categorykey": req.body.category,
    //                             "modifiedby": req.body.modifiedby,
    //                             "modifydate": new Date().toUTCString(),
    //                             "status": req.body.status,
    //                             "index": info.index
    //                         }, (err, results) => {
    //                             if (err) {
    //                                 console.log("Failed to updated History");
    //                                 res.status(500).send();
    //                             } else {
    //                                 //  console.log("Blog History Table is updated successfuly");
    //                             }
    //                         });

    //                         blogs.blogs(function(err, results) {
    //                             if (err) {
    //                                 res.status(500).send();
    //                             } else {
    //                                 if (results.length == 0) {
    //                                     results = { count: 0 };
    //                                     res.render('bloggers', { title: 'Blogs', isBlogUpdated: false, category: categoryList, blogs: results, index: 1 });
    //                                 } else {
    //                                     res.render('bloggers', { title: 'Blogs', isBlogUpdated: true, category: categoryList, topic: topic, blogs: results, index: results.length + 1 });
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 db.get().collection("blogs").save(req.body, (err, results) => {
    //                     if (err) {
    //                         res.status(500).send();
    //                     } else {
    //                         console.log("blogs details Saved Successfully");
    //                         blogs.blogs(function(err, results) {
    //                             if (err) {
    //                                 res.status(500).send();
    //                             } else {
    //                                 if (results.length == 0) {
    //                                     results = { count: 0 };
    //                                     res.render('bloggers', { title: 'Blogs', isBlogAdded: false, category: categoryList, blogs: results, index: 1 });
    //                                 } else {
    //                                     req.body = "";
    //                                     res.render('bloggers', { title: 'Blogs', isBlogAdded: true, category: categoryList, blogs: results, index: results.length + 1 });
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // } else {
    //     db.get().collection("blogs").save({
    //         "topic": req.body.topic,
    //         "content": req.body.content,
    //         "categorykey": req.body.category,
    //         "createdby": req.body.createdby,
    //         "creationdate": new Date().toUTCString(),
    //         "status": status.pending,
    //         "index": req.body.index
    //     }, (err, results) => {
    //         if (err) {
    //             res.status(500).send();
    //         } else {
    //             console.log("Blog Data Saved Successfully");
    //             blogs.blogs(function(err, results) {
    //                 if (err) {
    //                     res.status(500).send();
    //                 } else {
    //                     if (results.length == 0) {
    //                         results = { count: 0 };
    //                         res.render('bloggers', { title: 'Blogs', isBlogAdded: false, blogs: results, index: 1 });
    //                     } else {
    //                         req.body = "";
    //                         res.render('bloggers', { title: 'Blogs', isBlogAdded: true, category: categoryList, blogs: results, index: results.length + 1 });
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // }
    // //}
    // //});
});

//================== edit blog =================
router.post("/savedata/edit", function(req, res) {

    if (req.url == '/savedata/edit') {
        var _id = req.body._id;
        var topic = req.body.topic;
        var content = req.body.content;
        var category = req.body.category;
        var userid = req.body.userid;
        var createdby = req.body.createdby;

        var isValid = (topic != null && content != null && category != null && userid != null);

        if (isValid) {
            var data = {
                "_id": _id,
                "topic": topic,
                "content": content,
                "category": category
                    //"userid": userid,
                    //"createdby": createdby
            }

            console.log("add " + JSON.stringify(data));

            blogger.editblog(data).then(function(results) {

                //console.log("savedata/add " + JSON.stringify(data));
                res.json(true);

            }).catch(function(err) {

                console.log(err);
                res.json(false);

            });

        } else {
            log.logger.error("Model layer blogs : editblog call : error : data not define");
            res.json({ "Error": "data not define" });
        }
    }
    return;
});

//================== Delete Blog =================
router.get('/delete/:_id', function(req, res) {

    var id = req.params._id;

    console.log("id " + id);

    //var blog = {};

    blogger.deleteblogbyblogid(id).then(function(response) {
        //console.log("edit " + response);
        //var blog = response.data;
        //console.log("info " + JSON.stringify(blog));

        //var data = {};
        //if (blog.count == 0) {
        //    blog = { "result": [], "count": 0 };

        //    data = { "category": categoryList, "blogs": blog };

        //console.log(blogs.count);
        //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: 0 });
        //     res.json(data);
        //} else {
        //    data = { "category": categoryList, "blogs": blog };
        res.json(true);
        //console.log(blogs.count);
        //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: nextIndex });
        //}
    }).catch(function(err) {
        console.log(err);
        //blog = { "result": [], "count": 0 };
        //data = { "category": categoryList, "blogs": blog };

        res.json(false);
    });

    // var id = req.params._id;

    // db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
    //     if (err) {
    //         res.status(500).send();
    //     } else {
    //         if (info._id != undefined) {
    //             topic = info.topic;

    //             db.get().collection('blogs').update({ "_id": ObjectId(info._id) }, {
    //                 $set: {
    //                     "status": status.deleted
    //                 }
    //             }, { upsert: true }, function(err, contacts) {
    //                 if (err) {
    //                     res.status(500).send();
    //                 } else {
    //                     console.log("Blogs deleted Successfully");

    //                     //Add update history 
    //                     db.get().collection("bloghistory").save({
    //                         "blog_id": info._id,
    //                         "topic": req.body.topic,
    //                         "content": req.body.content,
    //                         "categorykey": req.body.category,
    //                         "modifiedby": req.body.modifiedby,
    //                         "modifydate": new Date().toUTCString(),
    //                         "status": req.body.status,
    //                         "index": req.body.index
    //                     }, (err, results) => {
    //                         if (err) {
    //                             console.log("Failed to updated History");
    //                             res.status(500).send();
    //                         } else {
    //                             console.log("Blog History Table is updated successfuly");
    //                         }
    //                     });

    //                     blogs.blogs(function(err, results) {
    //                         if (err) {
    //                             res.status(500).send();
    //                         } else {
    //                             res.render('bloggers', { title: 'Blogs', isBlogDeleted: true, topic: topic, category: categoryList, blogs: results, index: results.length + 1 });
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // });
});

//================== Edit Blog =================
router.get('/edit/:_id', function(req, res) {
    var id = req.params._id;

    console.log("id " + id);

    //var blog = {};

    blogger.getblogbyblogid(id).then(function(response) {
        console.log("edit " + response);
        var blog = response.data;
        console.log("info " + JSON.stringify(blog));

        var data = {};
        if (blog.count == 0) {
            blog = { "result": [], "count": 0 };

            data = { "category": categoryList, "blogs": blog };

            //console.log(blogs.count);
            //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: 0 });
            res.json(data);
        } else {
            data = { "category": categoryList, "blogs": blog };
            res.json(data);
            //console.log(blogs.count);
            //res.render('blogs', { title: 'Blogs', category: categoryList, blogs: blogs, index: nextIndex });
        }
    }).catch(function(err) {
        console.log(err);
        blog = { "result": [], "count": 0 };
        data = { "category": categoryList, "blogs": blog };

        res.json(data);
    });


    // res.json()

    //         //res.render('blogs', { title: 'Blogs', selectedBlogForEdit: true, category: categoryList, blogs: info, index: info.result.index });
    //     }).catch(function(err) {
    //         console.log(err);
    //         res.status(500).send();
    //     });




    // db.get().collection('blogs').findOne({ _id: ObjectId(id) }, function(err, info) {
    //     if (err) {
    //         res.status(500).send();
    //     } else {
    //         res.render('bloggers', { title: 'Blogs', selectedBlogForEdit: true, category: categoryList, blogs: info, index: info.index });
    //     }
    // });
});

//================== Load add Blog Form =================
router.get('/loadaddfrm', function(req, res) {
    var data = {};
    data = { selectedBlogForEdit: false, "category": categoryList };
    res.json(data);
});