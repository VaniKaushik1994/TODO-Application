const fs = require('fs');

const Logger = (exports.Logger = {});

const logStream = fs.createWriteStream("./logs/log.txt");

Logger.info = function({ msg}){
    logStream.write(`INFO: ${ new Date().toISOString() }: ${ msg }\n`)
}

Logger.error = function({ msg}){
    logStream.write(`ERROR: ${ new Date().toISOString() }: ${ msg }\n`)
}

Logger.success = function({ msg}){
    logStream.write(`SUCCESS: ${ new Date().toISOString() }: ${ msg }\n`)
}