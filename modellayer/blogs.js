"use strict";
var axios = require("axios");
var config = require("config");
var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.category = require("../data/blogcategory.json");

exports.blogs = function(startindex, categorytype) {
    let path = serviceURL + "/getblogs/" + startindex + "/" + categorytype;
    console.log("path:" + path);
    log.logger.info("Model layer blogs : service call : " + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer blogs : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer blogs : service call : error : " + error);
                reject(err);
            });
    });
}

exports.blogsbyuserid = function(startindex, userid) {
    let path = serviceURL + "/getblogsbyuserid/" + userid + "/" + startindex;
    console.log("path:" + path);
    log.logger.info("Model layer blogsbyuserid : service call : " + path);
    console.log("111");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("2");
                log.logger.info("Model layer blogsbyuserid : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                //console.log("3");
                var err = { "Error": error };
                log.logger.error("Model layer blogsbyuserid : service call : error : " + error);
                reject(err);
            });
    });
}

exports.addblog = function(data) {
    let path = serviceURL + "/addblog";
    console.log("path:" + path);
    log.logger.info("Model layer addblog : service call : " + path);
    //console.log("111");
    return new Promise(function(resolve, reject) {
        axios.post(path, data).then(function(response) {
                //console.log("2");
                log.logger.info("Model layer addblog : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                //console.log("3");
                var err = { "Error": error };
                log.logger.error("Model layer addblog : service call : error : " + error);
                reject(err);
            });
    });
}

exports.getblogbyblogid = function(blogid) {
    let path = serviceURL + "/getblogbyblogid/" + blogid;
    console.log("path:" + path);
    log.logger.info("Model layer getblogbyblogid : service call : " + path);
    console.log("getblogbyblogid 111");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("getblogbyblogid 2");
                log.logger.info("Model layer getblogbyblogid : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                console.log("getblogbyblogid 3");
                var err = { "Error": error };
                log.logger.error("Model layer getblogbyblogid : service call : error : " + error);
                reject(err);
            });
    });
}

exports.deleteblogbyblogid = function(_id) {
    let path = serviceURL + "/deleteblogbyblogid/" + _id;
    console.log("path:" + path);
    log.logger.info("Model layer deleteblogbyblogid : service call : " + path);
    console.log("111");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("2");
                log.logger.info("Model layer deleteblogbyblogid : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                //console.log("3");
                var err = { "Error": error };
                log.logger.error("Model layer deleteblogbyblogid : service call : error : " + error);
                reject(err);
            });
    });
}

exports.editblog = function(data) {
    let path = serviceURL + "/editblog";
    console.log("path:" + path);
    log.logger.info("Model layer editblog : service call : " + path);
    console.log("111");
    return new Promise(function(resolve, reject) {
        axios.post(path, data).then(function(response) {
                console.log("2");
                log.logger.info("Model layer editblog : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                console.log("3");
                var err = { "Error": error };
                log.logger.error("Model layer editblog : service call : error : " + error);
                reject(err);
            });
    });
}

// exports.getblogbyblogid = function(_id) {
//     let path = serviceURL + "/getblogbyblogid/" + _id;
//     console.log("path:" + path);
//     log.logger.info("Model layer : getblogbyblogid : service call : " + path);
//     //console.log("111");
//     return new Promise(function(resolve, reject) {
//         axios.post(path, data).then(function(response) {
//                 console.log("2");
//                 log.logger.info("Model layer : getblogbyblogid : service call : success");
//                 resolve(response);
//             })
//             .catch(function(error) {
//                 console.log("3");
//                 var err = { "Error": error };
//                 log.logger.error("Model layer : getblogbyblogid : service call : error : " + error);
//                 reject(err);
//             });
//     });
// }

exports.getblogcommentbyblogid = function(blogid, startindex) {
    let path = serviceURL + "/getblogcommentbyblogid/" + blogid + "/" + startindex;
    console.log("path:" + path);
    log.logger.info("Model layer : getblogcommentbyblogid : service call : " + path);
    console.log("getblogcommentbyblogid 1114");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("getblogcommentbyblogid 21");
                log.logger.info("Model layer : getblogcommentbyblogid : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                console.log("getblogcommentbyblogid 31");
                var err = { "Error": error };
                log.logger.error("Model layer : getblogcommentbyblogid : service call : error : " + error);
                reject(err);
            });
    });
}

exports.viewrecentblogs = function() {
    let path = serviceURL + "/getmostrecentblogs/";
    console.log("path:" + path);
    log.logger.info("Model layer : viewrecentblogs : service call : " + path);
    console.log("viewrecentblogs 1114");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("viewrecentblogs 21");
                log.logger.info("Model layer : viewrecentblogs : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                console.log("viewrecentblogs 31");
                var err = { "Error": error };
                log.logger.error("Model layer : viewrecentblogs : service call : error : " + error);
                reject(err);
            });
    });
}

exports.addcomment = function(data) {
    let path = serviceURL + "/addblogcomment";
    console.log("path:" + path);
    log.logger.info("Model layer : addblogcomment : service call : " + path);
    console.log("addblogcomment 1114");
    return new Promise(function(resolve, reject) {
        axios.post(path, data).then(function(response) {
                console.log("addblogcomment 21");
                log.logger.info("Model layer : addblogcomment : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                console.log("addblogcomment 31");
                var err = { "Error": error };
                log.logger.error("Model layer : addblogcomment : service call : error : " + error);
                reject(err);
            });
    });
}