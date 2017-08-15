"use strict";
var axios = require("axios");
var config = require("config");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.blogs = function(startindex, categorytype) {
    let path = serviceURL + "/getblogs/" + startindex + "/" + categorytype;
    console.log("path:" + path);

    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                console.log("api error:" + error);
                var err = { "Error": error };
                //return err;
                reject(err);
            });
    });
}