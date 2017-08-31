"use strict";
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
var alasql = require("alasql");
//var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.GetAllUserCount = function() {
    let findAllUserPath = serviceURL + "/findall/users/all/";
    let findSubscribeUserAllPath = serviceURL + "/findall/subscribeUser/all";
    return new Promise(function(resolve, reject) {
        Promise.all([
            findAll(findAllUserPath),
            findAll(findSubscribeUserAllPath)
        ]).then(data => {
            var collection = {
                "totalUser": data[0].data.count,
                "totalSbUser": data[1].data.count
                    //  "totalGoogleUser": data[2].data.count,
                    // "totalFBUser": data[3].data.count
            };
            resolve(collection);
        }).catch(function(err) {
            console.log("err:" + err);
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
            console.log("err:" + err);
            reject(err);
        });
    });
};

exports.GetUserBlogs = function() {
    let findUserBlogs = serviceURL + "/findall/blogs/all";
    return new Promise(function(resolve, reject) {
        findAll(findUserBlogs)
            .then(data => {
                var collectionList = userBlogsCollection(data.data);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("err:" + err);
                reject(err);
            });
    });
};

exports.GetUserComments = function() {
    let findUserComments = serviceURL + "/findall/comments/all";
    return new Promise(function(resolve, reject) {
        findAll(findUserComments)
            .then(data => {
                var collectionList = userCommentCollection(data.data);
                resolve(collectionList);
            }).catch(function(err) {
                console.log("err:" + err);
                reject(err);
            });
    });
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
    return collection;
};

let userCommentCollection = (data) => {
    var collection = [];
    // get Total blogs 
    collection.push(alasql(
        "SELECT count(*) as total , 'Total comments' as text FROM ?", [data.result]
    ));

    // get Total approved blogs 
    collection.push(alasql(
        "SELECT count(*) as total, 'Total approved' as text FROM ? where IsApproved=true", [data.result]
    ));

    // get Total disapproved blogs
    collection.push(alasql(
        "SELECT count(*) as total, 'Total disapproved' as text FROM ? where IsApproved=false", [data.result]
    ));
    //console.log("userCommentCollection:" + JSON.stringify(collection));
    return collection;
};

let userBlogsCollection = (data) => {
    // console.log(JSON.stringify(data));
    var collection = [];
    // get Total blogs 
    collection.push(alasql(
        "SELECT categorykey , count(*) as total FROM ? GROUP BY categorykey", [data.result]
    ));

    console.log("userBlogsCollection:" + JSON.stringify(collection));
    // $.each(collection, function(i, data) {
    //     if (data["key"] === match) {
    //         node = data["name"];
    //     }
    // });
    // for (var i in collection[0]) {
    //     console.log(JSON.stringify(i));
    //     validateCategory(i["categorykey"]);
    // }
    return collection;
};

let validateCategory = (match) => {
    console.log("Match:" + JSON.stringify(match));
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