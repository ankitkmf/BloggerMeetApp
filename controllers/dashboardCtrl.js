var express = require("express");
var router = express.Router();
var config = require("config");
const serviceURL = config.get("app.restAPIEndpoint.v1ContractPath");
var axios = require("axios");


module.exports = router;

router.get("/dashboard", function(req, res) {

    let findAllUserPath = serviceURL + "/findall/users/all/";
    let findSubscribeUserAllPath = serviceURL + "/findall/subscribeUser/all";
    let findFacebookAllPath = serviceURL + "/findall/users/facebook/";
    let findGoogleAllPath = serviceURL + "/findall/users/google/";

    Promise.all([
        findAll(findAllUserPath),
        findAll(findSubscribeUserAllPath),
        findAll(findFacebookAllPath),
        findAll(findGoogleAllPath)
    ]).then(data => {
        var collection = {
            "totalUser": data[0].data.count,
            "totalSbUser": data[1].data.count,
            "totalGoogleUser": data[2].data.count,
            "totalFBUser": data[3].data.count
        };
        res.render('dashboard', { layout: 'default', title: 'Dashboard Page', result: collection });
    }).catch(function(err) {
        console.log("err:" + err);
        res.status(500).send();
    });
});

let findAll = function(path) {
    return new Promise(function(resolve, reject) {
        axios.get(path).then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                var err = { "Error": error };
                console.log("Error return for:" + path + " :" + error);
                reject(err);
            });
    });
}