"use strict";
var axios = require("axios");
var config = require("config");
var log = require("../modellayer/log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.find = function(email) {
    let path = serviceURL + "/validateUserEmail";
    var filter = {
        "email": email
    };
    return new Promise(function(resolve, reject) {
        axios.post(path, filter).then(function(response) {
                log.logger.info("Passport Auth : find : user info retrival : success");
                saveLoginHistory(response, email);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "PassportError": error };
                log.logger.error("Passport Auth : find : error " + error);
                reject(err);
            });
    });
}

let saveLoginHistory = (response, email) => {
    let path = serviceURL + "/saveLoginHistory";
    var result = {
        "username": response.data.result[0].username,
        "name": response.data.result[0].username,
        "email": email,
        "authType": response.data.result[0].authType,
        "profileID": response.data.result[0]._id
    };
    axios.post(path, result)
        .then(function(response) {
            console.log("saveLoginHistory api response:" + response);
        })
        .catch(function(error) {
            console.log("saveLoginHistory api error:" + error);
        });
};