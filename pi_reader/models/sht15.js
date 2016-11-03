var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getSht15Reading(callback) {
    var reading;
    exec('python /usr/local/bin/sht -v -trd 4 17', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        var obj = JSON.parse(reading);
        var objason = { 
            createdAt : Date.now(), 
            id : uuid.v4(), 
            ip : "piSerial#", 
            ok : true, 
            sensor : "Sht15", 
            val : 34.34           
        } 
        callback(null, objason, "Sht15");
    });
}