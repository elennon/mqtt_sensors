var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getHfluxReading(callback) {
    var reading;
    exec('python /home/ed/projects/ply.py', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        //var obj = JSON.parse(reading);
        var objason = { 
            createdAt : Date.now(), 
            id : uuid.v4(), 
            ip : "piSerial#", 
            ok : true, 
            sensor : "Hflux", 
            val : 34.34
        } 
        callback(null, objason, "Hflux");
    });
}