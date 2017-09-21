"use strict";
var axios = require("axios");
var config = require("config");
var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.savequery = (data) => {

    let path = serviceURL + "/contactus/savequery";

    //console.log(path);

    log.logger.info("Model layer Contact us : sendquery : service call : " + path);
    //console.log("111");
    return new Promise(function(resolve, reject) {
        axios.post(path, data).then(function(response) {
                //console.log("2");
                log.logger.info("Model layer Contact us : sendquery : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                //console.log("3");
                var err = { "Error": error };
                log.logger.error("Model layer Contact us : sendquery : service call : error : " + error);
                reject(err);
            });
    });

}