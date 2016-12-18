var uuid = require('node-uuid');
const exec = require('child_process').exec;
var fs = require('fs');

module.exports = function getMlx906Reading(pi, callback) {
    var reading;
    exec('sudo /home/pi/projects/mqtt_sensors/pi_reader/scripts/eye2c', (error, stdout, stderr) => {
        if (error) {
            fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'mlx906 error-- data: ' + data, function (err) {
            });
            return callback(error);
        }
        if (stderr) {
            fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'mlx906 error-- data: ' + data, function (err) {
            });
            return callback(error);
        }
        reading = `${stdout}`;
        if(reading){
            var obj = reading.split(',');
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : pi.id, 
                ok : true, 
                sensor : "Mlx906", 
                ambiTemp : obj[0].trim(),
                skyTemp : obj[1].trim()
            } 
        }
        //console.log(objason);
        callback(null, objason, "Mlx906");
    });
}
