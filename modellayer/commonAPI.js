"use strict";
var express = require("express");
var router = express.Router();
var request = require("request");
var config = require("config");
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

router.post("/data/signUp", function(req, res) {
    //request.post('http://service.com/upload', {form:{key:'value'}})
    // or
    //request.post('http://service.com/upload').form({key:'value'})
    // or
    //request.post({ url: 'http://service.com/upload', form: { key: 'value' } }, function(err, httpResponse, body) { /* ... */ })

    let path = serviceURL + "/saveSignUp/";
    console.log("path:" + path);

    request.post(path).form({ key: 'vaskar' });


    // if (type != null) {
    //     dataFilter = { "usernamehash": false, "password": false };
    //     var whereFilter = {};
    //     switch (type) {
    //         case "admin":
    //             whereFilter = { "admin": true };
    //             break;
    //         case "active":
    //             whereFilter = { "active": true };
    //             break;
    //         case "deactive":
    //             whereFilter = { "active": false };
    //             break;
    //         case "email":
    //             whereFilter = { "IsEmailVerified": false };
    //             break;
    //     }

    //     db.find("users", dataFilter, whereFilter).then(function(results) {
    //         res.json(results);
    //     });
    //} else
    res.json(false);
});