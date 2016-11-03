var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getMlx906Reading(callback) {
    var reading;
    exec('sh -c \"sudo {0}\"", "/home/pi/PiSensors/PiSensors/src/eye2c', (error, stdout, stderr) => {
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
            sensor : "Mlx906", 
            ambiTemp : 34.34,
            skyTemp : 66.77
        } 
        callback(null, objason, "Mlx906");
    });
}