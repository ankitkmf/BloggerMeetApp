"use strict";
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
var alasql = require("alasql");
//var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.GetAllUserCount = function(id) {
    let findAllUserPath = serviceURL + "/findall/users/all/";
    let findSubscribeUserAllPath = serviceURL + "/findall/subscribeUser/all";
    let findOnePath = serviceURL + "/findone/" + "users" + "/" + id;
    console.log("Path:" + findOnePath);
    return new Promise(function(resolve, reject) {
        Promise.all([
            findAll(findAllUserPath),
            findAll(findSubscribeUserAllPath),
            findOne(findOnePath),
        ]).then(data => {
            // console.log("data:" + JSON.stringify(data[2].data));
            var collectionList = GetAllUserCountCollection(data);
            var collection = {
                "totalUser": collectionList[0][0].total, // data[0].data.count,
                "totalSbUser": collectionList[3][0].total,
                "totalGoogleUser": collectionList[1][0].total,
                "totalFBUser": collectionList[2][0].total,
                "userID": (data[2].data.result != null) ? id : ""
            };
            resolve(collection);
        }).catch(function(err) {
            console.log("GetAllUserCount err:" + err);
            reject(err);
        });
    });
};

exports.GetUserGraph = function() {
    let findAllUserPath = serviceURL + "/findall/users/all/";
    let findSubscribeUserAllPath = serviceURL + "/findall/subscribeUser/all";
    return new Promise(function(resolve, reject) {
        Promise.all([
            findAll(findAllUserPath),
            findAll(findSubscribeUserAllPath)
        ]).then(data => {
            var collectionList = userGraphCollection(data);
            resolve(collectionList);
        }).catch(function(err) {
            console.log("GetUserGraph err:" + err);
            reject(err);
        });
    });
};

exports.GetUserBlogs = function(type, id) {
    //console.log("type:" + type + " ,id:" + id);
    let findUserBlogs = "";
    if (type === "all")
        findUserBlogs = serviceURL + "/findall/blogs/all";
    else
        findUserBlogs = serviceURL + "/findall/blogs/userblogbyid/" + id;
    //let findUserBlogs = serviceURL + "/findall/blogs/all";
    return new Promise(function(resolve, reject) {
        findAll(findUserBlogs)
            .then(data => {
                var collectionList = userBlogsCollection(data.data);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("GetUserBlogs err:" + err);
                reject(err);
            });
    });
};

exports.GetUserSerach = function() {
    let findAllUser = serviceURL + "/findall/users/all";
    return new Promise(function(resolve, reject) {
        findAll(findAllUser)
            .then(data => {
                resolve(data.data.result);
            }).catch(function(err) {
                console.log("GetUserSerach err:" + err);
                reject(err);
            });
    });
};

exports.GetUserComments = function(type, id) {
    //let findUserComments = serviceURL + "/findall/comments/all";
    let findUserComments = "";
    if (type === "all")
        findUserComments = serviceURL + "/findall/comments/all";
    else
        findUserComments = serviceURL + "/findall/comments/usercommentsbyid/" + id;
    return new Promise(function(resolve, reject) {
        findAll(findUserComments)
            .then(data => {
                var collectionList = userCommentCollection(data.data);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("GetUserComments err:" + err);
                reject(err);
            });
    });
};

exports.GetUserHistory = function(type, id) {
    // console.log("type:" + type + " ,id:" + id);
    let findUserHistory = "";
    if (type === "all")
        findUserHistory = serviceURL + "/findall/userLoginHistory/alluserhistory";
    else
        findUserHistory = serviceURL + "/findall/userLoginHistory/userhistorybyid/" + id;
    console.log(findUserHistory);
    return new Promise(function(resolve, reject) {
        findAll(findUserHistory)
            .then(data => {
                var collectionList = userHistoryCollection(data.data, type);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("GetUserHistory err:" + err);
                reject(err);
            });
    });
};

exports.GetuserInfo = function(type, id) {
    //let findUserInfo = serviceURL + "/findall/users/all";
    let findUserInfo = "";
    if (type === "all")
        findUserInfo = serviceURL + "/findall/users/all";
    else
        findUserInfo = serviceURL + "/findall/users/userinfobyid/" + id;
    return new Promise(function(resolve, reject) {
        findAll(findUserInfo)
            .then(data => {
                var collectionList = userInfoCollection(data.data);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("GetuserInfo err:" + err);
                reject(err);
            });
    });
};

exports.GetUserTableData = function(type) {
    return new Promise(function(resolve, reject) {
        if (type != null) {
            let findUserTableData = serviceURL; //+ "/findall/users/all";
            switch (type) {
                case "totalUser":
                    // whereFilter = { "admin": true };
                    findUserTableData += "/findall/users/all";
                    break;
                case "adminUser":
                    //whereFilter = { "admin": true };
                    findUserTableData += "/findall/users/admin/true";
                    break;
                case "activeUser":
                    // whereFilter = { "active": true };
                    findUserTableData += "/findall/users/active/true";
                    break;
                case "deactiveUser":
                    //whereFilter = { "active": false };
                    findUserTableData += "/findall/users/active/false";
                    break;
                case "emailVeriPending":
                    //whereFilter = { "IsEmailVerified": false };
                    findUserTableData += "/findall/users/email/false";
                    break;
            }

            // console.log("findUserTableData path:" + findUserTableData);
            findAll(findUserTableData)
                .then(data => {
                    // var collectionList = userInfoCollection(data.data);
                    //console.log("GetUserTableData:" + JSON.stringify(data.data));
                    resolve(data.data);
                }).catch(function(err) {
                    console.log("GetUserTableData err:" + err);
                    reject(err);
                });
        } else
            reject({ "err": "type is not define" });
    });
};

exports.GetUserBlogTableData = function(type) {
    return new Promise(function(resolve, reject) {
        if (type != null) {
            let findUserBlogTableData = serviceURL; //+ "/findall/users/all";
            switch (type) {
                case "totalblog":
                    findUserBlogTableData += "/findall/blogs/all";
                    break;
                case "bApproved":
                    findUserBlogTableData += "/findall/blogs/status/1";
                    break;
                case "bDisapproved":
                    findUserBlogTableData += "/findall/blogs/status/2";
                    break;
                case "bPending":
                    findUserBlogTableData += "/findall/blogs/status/0";
                    break;
            }

            console.log("findUserBlogTableData path:" + findUserBlogTableData);
            findAll(findUserBlogTableData)
                .then(data => {
                    // var collectionList = userInfoCollection(data.data);
                    console.log("GetUserBlogTableData:" + JSON.stringify(data.data));
                    resolve(data.data);
                }).catch(function(err) {
                    console.log("GetUserBlogTableData err:" + err);
                    reject(err);
                });
        } else
            reject({ "err": "type is not define" });
    });
};


let userHistoryCollection = (data) => {
    var collection = [];
    var innerCoollection = [];
    collection.push(alasql(
        "SELECT INDEX name,COUNT(*) AS cnt FROM ? GROUP BY name", [data.result]
    ));
    //console.log("stp1:" + JSON.stringify(collection));
    var keys = Object.keys(collection[0]);
    for (var i = 0; i < keys.length; i++) {
        //  console.log(i + " : " + keys[i]);
        innerCoollection.push(alasql(
            "SELECT count(*) as total, dateTime, '" + keys[i] + "' as text FROM ? where name='" + keys[i] + "' GROUP BY  dateTime ", [data.result]
        ));
    }
    //console.log("innerCoollection:" + JSON.stringify(innerCoollection));

    return innerCoollection;
};

let findAll = function(path) {
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log("Error return for:" + path + " :" + error);
                reject(err);
            });
    });
};

let findOne = function(path) {
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log("Error return for:" + path + " :" + error);
                reject(err);
            });
    });
};

let GetAllUserCountCollection = data => {
    var collection = [];
    // get local user 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total users' as text FROM ?", [data[0].data.result]
    ));

    // get google user 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total google users' as text FROM ? where authType='google'", [data[0].data.result]
    ));

    // get facebook user 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total facebook users' as text FROM ? where authType='facebook'", [data[0].data.result]
    ));

    // get Subscribe user 
    collection.push(alasql(
        "SELECT count(*) as total, 'Subscribe Users' as text FROM ? ", [data[1].data.result]
    ));
    return collection;
};

let userGraphCollection = (data) => {
    var collection = [];
    // get local user 
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Local users' as text FROM ? where authType='local' GROUP BY  dateTime ", [data[0].data.result]
    ));

    // get google user 
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Google users' as text FROM ? where authType='google' GROUP BY  dateTime ", [data[0].data.result]
    ));

    // get facebook user 
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Facebook users' as text FROM ? where authType='facebook' GROUP BY  dateTime ", [data[0].data.result]
    ));

    // get Subscribe user 
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Subscribe Users' as text FROM ? GROUP BY  dateTime ", [data[1].data.result]
    ));

    // console.log("collection:" + JSON.stringify(collection));
    return collection;
};

let userCommentCollection = (data) => {
    var collection = [];
    // get Total blogs 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total comments' as text FROM ?", [data.result]
    ));

    // get Total approved comments 
    collection.push(alasql(
        "SELECT count(*) as total, 'Total approved' as text FROM ? where status='1'", [data.result]
    ));

    // get Total disapproved comments
    collection.push(alasql(
        "SELECT count(*) as total, 'Total disapproved' as text FROM ? where status='2'", [data.result]
    ));

    // get Total pending comments
    collection.push(alasql(
        "SELECT count(*) as total, 'Total pending' as text FROM ? where status='0'", [data.result]
    ));
    //console.log("userCommentCollection:" + JSON.stringify(collection));
    return collection;
};

let userInfoCollection = (data) => {
    var collection = [];
    collection.push(
        alasql("SELECT count(*) as total, 'Total' as text,'totalUser' as key FROM ?", [data.result])
    );
    collection.push(
        alasql("SELECT count(*) as total, 'Admin' as text ,'adminUser' as key FROM ? where admin=true", [data.result])
    );
    collection.push(
        alasql("SELECT count(*) as total, 'Active' as text ,'activeUser' as key FROM ? where active=true", [data.result])
    );
    collection.push(
        alasql("SELECT count(*) as total, 'Deactive' as text ,'deactiveUser' as key FROM ? where active=false", [data.result])
    );
    collection.push(
        alasql("SELECT count(*) as total, 'Email verification pending' as text ,'emailVeriPending' as key FROM ? where IsEmailVerified=false", [data.result])
    );
    // console.log("userInfoCollection:" + JSON.stringify(collection));
    return collection;
};

let userBlogsCollection = (data) => {
    var collection = [];
    // get Total blogs 
    // collection.push(alasql(
    //     "SELECT categorykey , count(*) as total FROM ? GROUP BY categorykey", [data.result]
    // ));

    // get Total blogs 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total' as text,'totalblog' as key FROM ?", [data.result]
    ));

    // get Total approved blogs 
    collection.push(alasql(
        "SELECT count(*) as total, 'Total approved' as text,'bApproved' as key FROM ? where status='1'", [data.result]
    ));

    // get Total disapproved blogs
    collection.push(alasql(
        "SELECT count(*) as total, 'Total disapproved' as text, 'bDisapproved' as key FROM ? where status='2'", [data.result]
    ));

    // get Total pending blogs
    collection.push(alasql(
        "SELECT count(*) as total, 'Total pending' as text, 'bPending' as key FROM ? where status='0'", [data.result]
    ));
    // console.log("userBlogsCollection:" + JSON.stringify(collection));
    return collection;
};

let userUserCollection = (data) => {
    var collection = [];
    // get Total blogs 
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Local users' as text FROM ? where authType='local' GROUP BY  dateTime ", [data.result]
    ));
    return collection;
};

let validateCategory = (match) => {
    //console.log("Match:" + JSON.stringify(match));
    var node = null;
    var categoryJSON = [
        { key: "0", name: "Technical Blog" },
        { key: "1", name: "Beginner Blog" },
        { key: "2", name: "Beginner Blog 1" },
        { key: "3", name: "Beginner Blog 2" }
    ];
    for (var i in categoryJSON) {
        if (i["key"] === match) {
            node = i["name"];
        }
    }
    console.log("Node:" + node);
    return node;
    // $.each(categoryJSON, function(i, data) {
    //     if (data["key"] === match) {
    //         node = data["name"];
    //     }
    // });
    // return node;
};