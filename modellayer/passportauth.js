"use strict";
var axios = require("axios");
var config = require("config");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.find = function(email, password) {
    let path = serviceURL + "/validateUserEmail"; ///" + startindex + "/" + categorytype;
    console.log("path:" + path);
    var filter = {
        "email": email
    };

    return new Promise(function(resolve, reject) {
        axios.post(path, filter).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                console.log("Passportapi error:" + error);
                var err = { "PassportError": error };
                reject(err);
            });
    });

    // return axios.post(path, filter)
    //     .then(function(response) {
    //         console.log("Passport api response:" + response);
    //         res.json(true);
    //     })
    //     .catch(function(error) {
    //         console.log("Passport api error:" + error);
    //         res.json({ "Error": "Passport api error" });
    //     });
}