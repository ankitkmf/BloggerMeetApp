"use strict";
var axios = require("axios");
var config = require("config");
var log = require("../modellayer/log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.find = function(email) {
    let path = serviceURL + "/validateUserEmail/" + email;
    var filter = {
        "email": email
    };
    console.log("Step 2 path:" + path);
    // console.log("Step 2.1 filter:" + JSON.stringify(filter));
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log("Step 3");
                // log.logger.info("Passport Auth : find : user info retrival : success");
                // saveLoginHistory(response, email);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "PassportError": error };
                console.log("Step 4 err:" + error);
                // log.logger.error("Passport Auth : find : error " + error);
                reject(err);
            });
    });
}

let saveLoginHistory = (response, email) => {
    let path = serviceURL + "/saveLoginHistory";
    var result = {
        "username": response.data.result.username,
        "name": response.data.result.username,
        "email": email,
        "authType": response.data.result.authType,
        "profileID": response.data.result._id
    };
    axios.post(path, result)
        .then(function(response) {
            console.log("saveLoginHistory api response:" + response);
        })
        .catch(function(error) {
            console.log("saveLoginHistory api error:" + error);
        });
};