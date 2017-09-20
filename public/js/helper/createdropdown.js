var _ = require("lodash");

module.exports = function(selecttype, fieldvalue) {

    var qualificationlist = {};
    var data = "";
    var experience = {};
    var educationyear = [];

    if (fieldvalue != undefined && selecttype == "qualification") {

        qualificationlist = require("../../../data/qualification.json");

        _.forEach(qualificationlist, function(result) {
            if (result.key == fieldvalue)
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;
    } else if (selecttype == "qualification") {

        qualificationlist = require("../../../data/qualification.json");

        _.forEach(qualificationlist, function(result) {
            if (result.key == "0")
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;
    } else if (fieldvalue != undefined && selecttype == "experience") {

        experience = require("../../../data/experience.json");

        _.forEach(experience, function(result) {
            if (result.key == fieldvalue)
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;
    } else if (selecttype == "experience") {

        experience = require("../../../data/experience.json");

        _.forEach(experience, function(result) {
            if (result.key == "0")
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;
    } else if (fieldvalue != undefined && selecttype == "educationyear") {

        var cuyear = (new Date).getFullYear();
        educationyear.push({
            "key": 0,
            "value": "-- Year of Passout --"
        });

        for (i = cuyear; i >= 1900; i--) {
            var yrs = {
                "key": i,
                "value": i
            }
            educationyear.push(yrs);
        }

        _.forEach(educationyear, function(result) {
            if (result.key == fieldvalue)
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;

    } else if (selecttype == "educationyear") {
        var cuyear = (new Date).getFullYear();

        educationyear.push({
            "key": 0,
            "value": "-- Year of Passout --"
        });

        for (i = cuyear; i >= 1900; i--) {
            var yrs = {
                "key": i,
                "value": i
            }

            educationyear.push(yrs);
        }

        _.forEach(educationyear, function(result) {
            if (result.key == "0")
                data += "<option value=" + result.key + " selected='selected'>" + result.value + "</option>";
            else
                data += "<option value=" + result.key + ">" + result.value + "</option>";
        });
        return data;
    }
};