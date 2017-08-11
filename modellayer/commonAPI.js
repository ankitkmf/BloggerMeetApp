"use strict";
var express = require("express");
var axios = require("axios");
var config = require("config");
var bcrypt = require('bcrypt');
var router = express.Router();
module.exports = router;
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

router.post("/data/signUp", function(req, res) {
    console.log("signup body:" + req.body);
    var isValid = (req.body != null && req.body != undefined && req.body.username != "" && req.body.name != "" && req.body.email != "" && req.body.password != "");
    if (isValid) {
        let path = serviceURL + "/saveSignUp/";
        console.log("path:" + path);

        var result = {
            "username": req.body.username,
            "name": req.body.name,
            "email": req.body.email,
            "password": bcrypt.hashSync(req.body.password, 10),
        };

        axios.post(path, result)
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