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
}

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