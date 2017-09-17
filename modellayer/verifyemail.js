"use strict";
var axios = require("axios");
var config = require("config");
var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.verifyemail = (userid) => {
    let path = serviceURL + "/verifyemail/" + userid;
    console.log("path:" + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer verifyemail method : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer verifyemail method : service call : error : " + error);
                reject(err);
            });
    });
}

exports.triggerverificationemail = (userid, DT) => {
    let path = serviceURL + "/verifyemailtrigger/";
    console.log("path:" + path);

    var data = {
        "userid": userid,
        "dt": DT
    };

    return new Promise(function(resolve, reject) {
        axios.post(path, data)
            .then(function(response) {
                console.log("api response:" + response);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log("api error:" + error);
                reject(err);
            });
    });
}