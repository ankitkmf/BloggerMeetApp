module.exports = function(isodate) {
    if (isodate != undefined) {
        return new Date(isodate).toUTCString();
    }
}