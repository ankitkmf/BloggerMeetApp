"use strict";
var express = require("express");
var axios = require("axios");
var config = require("config");
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

router.post("/data/signUp", function(req, res) {
    console.log("signup body:" + req.body);
    var isValid = (req.body != null && req.body != undefined && req.body.username != "" && req.body.name != "" && req.body.email != "" && req.body.password != "");
    if (isValid) {
        let path = serviceURL + "/saveSignUp/";
        console.log("path:" + path);

        // var result = {
        //     "username": 1,
        //     "name": 2,
        //     "email": 3,
        //     "password": 4
        // };

        axios.post(path, req.body)
            .then(function(response) {
                console.log("api response:" + response);
                res.json(true);
            })
            .catch(function(error) {
                console.log("api error:" + error);
                res.json({ "Error": "signUp api error" });
            });
    } else {
        res.json({ "Error": "data not define" });
    }

});