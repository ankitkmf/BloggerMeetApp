"use strict";
var axios = require("axios");
var config = require("config");
var log = require("../modellayer/log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.find = function(email, password) {
    let path = serviceURL + "/validateUserEmail"; ///" + startindex + "/" + categorytype;
    console.log("path:" + path);
    var filter = {
        "email": email
    };

    return new Promise(function(resolve, reject) {
        axios.post(path, filter).then(function(response) {
                log.logger.info("Passport Auth : find : user info retrival : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "PassportError": error };
                log.logger.error("Passport Auth : find : error " + error);
                reject(err);
            });
    });
}