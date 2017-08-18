'use strict'
var config = require("config");

module.exports = () => {
    return {
        getLog: {
            getErrorFolderPath: () => {
                const tsFormat = "ss";
                return config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.errorLogFileName') + ".log";
            },
            getInfoFolderPath: () => {
                const tsFormat = "ss";
                return config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.infoLogFileName') + ".log";
            },
            logLevel: 'debug'
        }
    }
};