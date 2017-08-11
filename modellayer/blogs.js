"use strict";
var axios = require("axios");
var config = require("config");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");

exports.blogs = function(startindex, categorytype) {
    let path = serviceURL + "/getblogs/" + startindex + "/" + categorytype;
    console.log("path:" + path);


    axios.get(path).then(function(response) {
            console.log("api response:" + JSON.parse(response));
            return response;
        })
        .catch(function(error) {
            console.log("api error:" + error);
            var err = { "Error": error };
            return err;
        });
}

// router.post("/data/signUp", function(req, res) {
//     console.log("signup body:" + req.body);
//     var isValid = (req.body != null && req.body != undefined && req.body.username != "" && req.body.name != "" && req.body.email != "" && req.body.password != "");
//     if (isValid) {
//         let path = serviceURL + "/saveSignUp/";
//         console.log("path:" + path);

//         // var result = {
//         //     "username": 1,
//         //     "name": 2,
//         //     "email": 3,
//         //     "password": 4
//         // };

//         axios.post(path, req.body)
//             .then(function(response) {
//                 console.log("api response:" + response);
//                 res.json(true);
//             })
//             .catch(function(error) {
//                 console.log("api error:" + error);
//                 res.json({ "Error": "signUp api error" });
//             });
//     } else {
//         res.json({ "Error": "data not define" });
//     }

// });