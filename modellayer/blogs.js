"use strict";
var axios = require("axios");
var config = require("config");
var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.category = require("../data/blogcategory.json");

exports.blogs = function(startindex, categorytype) {
    let path = serviceURL + "/getblogs/" + startindex + "/" + categorytype;
    console.log("path:" + path);
    log.logger.info("Model layer blogs : service call : " + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                log.logger.info("Model layer blogs : service call : success");
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                log.logger.error("Model layer blogs : service call : error : " + error);
                reject(err);
            });
    });
}