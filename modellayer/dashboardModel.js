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
            var collectionList = userGraphCollection(data);
            resolve(collectionList);
        }).catch(function(err) {
            console.log("err:" + err);
            reject(err);
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