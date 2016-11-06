var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getCTReading(callback) {
    var reading;
    exec('python /home/pi/projects/mqtt_reader/pi_reader/scripts/getcps.py', (error, stdout, stderr) => {    ///home/pi/PiSensors/PiSensors/python/getcps.py
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
            sensor : "Cavity Temp: " + obj.sensorId, 
            val : obj.val
        } 
        //console.log(objason);
        callback(null, objason, "CavityTemp");
    });
}
