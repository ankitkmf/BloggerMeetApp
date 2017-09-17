"use strict";
var axios = require("axios");
var config = require("config");
var log = require("../modellayer/log");
var bcrypt = require('bcrypt');
// var passportauth = require("../modellayer/passportauth");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");


exports.find = function(email) {
    console.log("Step 3");
    return new Promise(function(resolve, reject) {
        console.log("Step 4");
        findUser(email).then(result => {
            resolve(result);
        }).catch(function(error) {
            var err = { "exports.find": error };
            console.log("Step 4 err:" + error);
            // log.logger.error("Passport Auth : find : error " + error);
            reject(err);
        });
    });
}
exports.validateGoogleUser = (googleUser) => {
    console.log("1");
    return new Promise(function(resolve, reject) {
        console.log("2");
        if (googleUser.email != null && googleUser.id != null) {
            console.log("3");
            findUser(googleUser.email).then((response) => {
                console.log("4");
                if (response != null && response.data != null && response.data.result.count > 0) {
                    console.log("5");
                    var user = {};
                    user = response.data.result.result;
                    //console.log(JSON.stringify(user));
                    console.log("Google user found in DB");
                    resolve(user); //done(null, user);
                } else {
                    console.log("6");
                    console.log("Google user doesn't found");
                    let path = serviceURL + "/saveSignUp/";
                    var user = {
                        "id": googleUser.id,
                        "username": googleUser.username,
                        "userImage": googleUser.userImage != null ? googleUser.userImage : "",
                        "authType": "google"
                    };
                    var result = {
                        "username": googleUser.username,
                        "name": googleUser.username,
                        "googlename": googleUser.username,
                        "facebookname": "",
                        "localemail": "",
                        "facebookemail": "",
                        "googleemail": googleUser.email,
                        "password": bcrypt.hashSync("test", 10),
                        "authType": "google",
                        "profileID": googleUser.id,
                        "userImage": googleUser.userImage != null ? googleUser.userImage : ""
                    };

                    axios.post(path, result)
                        .then(function(response) {
                            console.log("Google user inserted in db ");
                            //return done(null, user);
                            resolve(user);
                        })
                        .catch(function(error) {
                            console.log("Error in inseration Google user in db ");
                            reject("");
                        });
                }
            }).catch(function(err) {
                console.log("Gooel passport find exception:" + err);
                log.logger.error("Passport Init : passportauth find : User Name : " + googleUser.username + " Error : " + err);
                reject("");
            });
        } else reject("");
    });
};

exports.mapGoogleUser = function(googleUser, mapUserAccount) {
    return new Promise(function(resolve, reject) {
        mapGoogleUserAccount(googleUser, mapUserAccount);
    });
}

let findUser = (email) => {
    let path = serviceURL + "/validateUserEmail/" + email;
    var filter = {
        "email": email
    };
    console.log("Step 5");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                if (response.data.result.count > 0)
                    saveLoginHistory(response.data.result.result, email);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "PassportError": error };
                console.log("Step 4 err:" + error);
                // log.logger.error("Passport Auth : find : error " + error);
                reject(err);
            });
    });
};

let saveLoginHistory = (response, email) => {
    let path = serviceURL + "/saveLoginHistory";
    var result = {
        "username": response.username,
        "name": response.username,
        "email": email,
        "authType": response.authType,
        "profileID": response._id
    };
    axios.post(path, result)
        .then(function(response) {
            //   console.log("saveLoginHistory api response:" );
        })
        .catch(function(error) {
            console.log("saveLoginHistory api error:" + error);
        });
};

let mapGoogleUserAccount = (googleUser, mapUserAccount) => {
    return new Promise(function(resolve, reject) {
        if (googleUser.email != null && googleUser.id != null) {
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

        } else reject("");
    });
};