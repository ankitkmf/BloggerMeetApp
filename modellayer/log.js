'use strict'
var bunyan = require('bunyan');
var fs = require("fs");
//var configs = require("./config");
var config = require("config");

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var dt = new Date();
const tsFormat = dt.getUTCFullYear() + "-" + dt.getUTCMonth() + "-" + dt.getUTCDay();

var errorFileName = "";
var infoFileName = "";

if (config.has('logging.logFolderName')) {
    infoFileName = config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.infoLogFileName') + ".log";
    errorFileName = config.get('logging.logFolderName') + tsFormat + "-" + config.get('logging.errorLogFileName') + ".log";
}

exports.logger = bunyan.createLogger({
    name: 'myapp',
    streams: [{
            level: 'info',
            path: infoFileName,
            type: 'rotating-file',
            period: '1d' // daily rotation 
                //count: 3
        },
        {
            level: 'error',
            type: 'rotating-file',
            path: errorFileName,
            period: '1d' // daily rotation 
                //count: 3
        }
    ]
});