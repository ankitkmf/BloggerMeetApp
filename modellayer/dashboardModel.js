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
            console.log(JSON.stringify(collection));
            resolve(collection);
            //res.render('dashboard', { layout: 'default', title: 'Dashboard Page', result: collection });
        }).catch(function(err) {
            console.log("err:" + err);
            reject(err);
            // res.status(500).send();
        });
    });
}

exports.GetUserGraph = function(id) {
    let findAllUserPath = serviceURL + "/findall/users/all/";
    let findSubscribeUserAllPath = serviceURL + "/findall/subscribeUser/all";
    return new Promise(function(resolve, reject) {
        Promise.all([
            findAll(findAllUserPath),
            findAll(findSubscribeUserAllPath)
        ]).then(data => {
            // console.log("Model:GetUserGraph:data:" + JSON.stringify(data[1].data));
            var collection = {
                "totalUser": data[0].data.count,
                "totalSbUser": data[1].data.count
                    //  "totalGoogleUser": data[2].data.count,
                    // "totalFBUser": data[3].data.count
            };

            // usergraphCollection(data);

            var collectionList = userGraphCollection(data);
            //  CreateUserGraph(collectionList);
            // console.log("collectionList:" + JSON.stringify(collectionList));
            resolve(collectionList);
            //res.render('dashboard', { layout: 'default', title: 'Dashboard Page', result: collection });
        }).catch(function(err) {
            console.log("err:" + err);
            reject(err);
            // res.status(500).send();
        });
    });
}

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
}

let userGraphCollection = (data) => {
    // console.log("Step1:" + JSON.stringify(data))
    var collection = [];
    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'User registration' as text FROM ? GROUP BY  dateTime ", [data[0].data.result]
    ));

    collection.push(alasql(
        "SELECT count(*) as total, dateTime, 'Subscribe Users' as text FROM ? GROUP BY  dateTime ", [data[1].data.result]
    ));

    // if (results != null) {
    //     $.each(results, function(i, result) {
    //         $.each(result, function(i, data) {
    //             collectionName = data["text"];
    //             var d = new Date(data["dateTime"]);
    //             var utcDate = Date.UTC(
    //                 d.getUTCFullYear(),
    //                 d.getUTCMonth(),
    //                 d.getUTCDate()
    //             );
    //             var data = [utcDate, data["total"]];
    //             collection.push(data);
    //         });
    //         collectionList.push({ name: collectionName, data: collection });
    //     });
    //     return collectionList;
    // } else
    //     return "";
    //   console.log("usergraphCollection:" + JSON.stringify(collection));
    return collection;
};