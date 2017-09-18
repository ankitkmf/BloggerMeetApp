"use strict";
var axios = require("axios");
var config = require("config");
var log = require("../modellayer/log");
var bcrypt = require('bcrypt');
// var passportauth = require("../modellayer/passportauth");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");


exports.find = function(email) {
    // console.log("Step 3");
    return new Promise(function(resolve, reject) {
        // console.log("Step 4");
        findUser(email).then(result => {
            resolve(result);
        }).catch(function(error) {
            console.log("exports.find err:" + error);
            reject(error);
        });
    });
}
exports.validateGoogleUser = (googleUser) => {
    return new Promise(function(resolve, reject) {
        if (googleUser.email != null && googleUser.id != null) {
            findUser(googleUser.email).then((response) => {
                if (response != null && response.data != null && response.data.result.count > 0) {
                    var user = {};
                    // console.log(JSON.stringify(response.data.result.result));
                    user = response.data.result.result;
                    console.log("Google user found in DB user:" + user._id);
                    resolve(user);
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
                        "email": "",
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
                            console.log("response.data:" + JSON.stringify(response.data));
                            if (response.data != null && response.data.resultID != null) {
                                user._id = response.data.resultID;
                                // console.log("user:" + JSON.stringify(user));
                                resolve(user);
                            }
                            reject(false);
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

    console.log("mapGoogleUser googleUser:" + JSON.stringify(googleUser));
    console.log("mapGoogleUser mapUserAccount:" + JSON.stringify(mapUserAccount));
    return new Promise(function(resolve, reject) {
        var path = serviceURL + "/updaterecords";
        var mapGoogleAccountData = {
            "type": "mapgoogleaccount",
            "id": mapUserAccount.id,
            "googleemail": googleUser.email,
            "googlename": googleUser.username,
            "userImage": googleUser.userImage,
            "authType": googleUser.authType
        };
        var mapBlogsData = {
            "type": "blogs",
            "userid": googleUser.id,
            "mapuserid": mapUserAccount.id,
            "createdby": mapUserAccount.username
        };
        var mapCommentsData = {
            "type": "comments",
            "userid": googleUser.id,
            "mapuserid": mapUserAccount.id,
            "createdby": mapUserAccount.username
        };
        var deactiveGoogleUserData = {
            "type": "deactivegoogleuser",
            "active": false,
            //  "id": googleUser.id,
            "googleemail": googleUser.email,
            "username": googleUser.username
        };
        var blogsHistoryPath = {
            "type": "blogshistory",
            "userid": googleUser.id,
            "mapuserid": mapUserAccount.id
        };
        var loginHistoryPath = {
            "type": "loginhistory",
            "userid": googleUser.id,
            "mapuserid": mapUserAccount.id,
            "username": googleUser.username
        };
        // resolve("true");
        Promise.all([
            saveRecords(path, mapGoogleAccountData),
            saveRecords(path, mapBlogsData),
            saveRecords(path, mapCommentsData),
            saveRecords(path, blogsHistoryPath),
            saveRecords(path, loginHistoryPath),
            saveRecords(path, deactiveGoogleUserData)
        ]).then(collectionList => {
            // console.log("data:" + JSON.stringify(data[2].data));
            // var collectionList = GetAllUserCountCollection(data);
            var collection = {
                "mapGoogleAccountData": collectionList[0].data, // data[0].data.count,
                "mapBlogsData": collectionList[1].data,
                "mapCommentsData": collectionList[2].data,
                "blogsHistoryPath": collectionList[3].data,
                "loginHistoryPath": collectionList[4].data,
                "deactiveGoogleUserData": collectionList[5].data,
            };

            console.log("collection:" + JSON.stringify(collection));
            resolve(true);
        }).catch(function(err) {
            console.log("GetAllUserCount err:" + err);
            reject(err);
        });
    });
}

let findUser = (email) => {
    let path = serviceURL + "/validateUserEmail/" + email;
    var filter = {
        "email": email
    };
    //console.log("Step 5");
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                if (response.data.result.count > 0)
                    saveLoginHistory(response.data.result.result, email);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "PassportError": error };
                //console.log("Step 4 err:" + error);
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

let saveRecords = (path, data) => {
    console.log("saveRecords ,data:" + JSON.stringify(data));
    // console.log("saveRecords for " + data + " ,whereQuery:" + JSON.stringify(whereQuery));
    return new Promise(function(resolve, reject) {
        axios.post(path, data).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                console.log("saveRecords err:" + error);
                reject(error);
            });
    });
};