var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getCTReading(callback) {
    var reading;
    exec('python /home/ed/projects/ply.py', (error, stdout, stderr) => {    ///home/pi/PiSensors/PiSensors/python/getcps.py
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
            sensor : "Cavity Temp", 
            val : 34.34
        } 
        callback(null, objason, "CavityTemp");
    });
}