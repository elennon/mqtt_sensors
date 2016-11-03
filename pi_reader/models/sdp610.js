var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getMlx906Reading(callback) {
    var reading;
    exec('php /home/pi/PiSensors/PiSensors/sensors_php/sdp.php', (error, stdout, stderr) => {
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
            sensor : "Sdp610", 
            val : 34.34           
        } 
        callback(null, objason, "Sdp610");
    });
}