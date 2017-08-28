module.exports = function (fieldvalue) {
    if (fieldvalue != undefined || fieldvalue == "yes") {
        return '<label class="control-label" for="admin">Is Admin: <input type="checkbox" id="admin" name="admin" value="yes"  checked="checked"></label>'
    }
    else
    {
        return '<label class="control-label" for="admin">Is Admin: <input type="checkbox" id="admin" name="admin" value="yes"></label>'
    }
}