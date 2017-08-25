"use strict";
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
//var log = require("./log");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.category = require("../data/blogcategory.json");

exports.findUser = function(id) {
    let path = serviceURL + "/findone/" + "users" + "/" + id;
    console.log(" findUser model Step 1 ,path:" + path);
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                console.log(" findUser model Step 1.2,Success:");
                // console.log(" findUser model Step 1.2,Success:" + JSON.parse(response.data));
                // log.logger.info("Model layer blogs : service call : success");
                // console.log("Success:" + (response));
                //return response;
                resolve(JSON.parse(response.data));
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log(" findUser model Step 1.3,Error:" + error);
                //console.log("err:" + error);
                // log.logger.error("Model layer blogs : service call : error : " + error);
                reject(err);
                // return error;
            });
    });
}

exports.updatePassword = function(id, pwd) {
    let path = serviceURL + "/updatepassword"; // + "users" + "/" + id;
    console.log("updatePassword model step 1");
    var result = {
        "id": id,
        "pwd": bcrypt.hashSync(pwd, 10)
    };
    console.log("updatePassword model step 2, result:" + JSON.stringify(result));
    // console.log("path:" + path);
    return new Promise(function(resolve, reject) {
        axios.post(path, result).then(function(response) {
                console.log("updatePassword model step 3, success:" + response);
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log("updatePassword model step 4, error:" + err);
                reject(err);
            });
    });
}

exports.validatePassword = function(cupwd, oldPwd) {

    console.log("validatePassword model step 1, cupwd:" + cupwd + " ,oldPwd:" + oldPwd);
    // console.log("path:" + path);
    return new Promise(function(resolve, reject) {
        bcrypt.compare(oldPwd, cupwd, function(err, res) {
            if (res) {
                console.log("validatePassword common step 2, pwd match");
                // return changePwd.updatePassword(req.body.id, req.body.npwd);
                resolve(true);
            } else {
                console.log("validatePassword common step 3, pwd not match");
                //  res.json(false);
                // next();
                reject(false);
            }
        });

        //     axios.post(path, result).then(function(response) {
        //             console.log("updatePassword model step 3, success:" + response);
        //             resolve(response);
        //         })
        //         .catch(function(error) {
        //             var err = { "Error": error };
        //             console.log("updatePassword model step 4, error:" + err);
        //             reject(err);
        //         });
    });
}