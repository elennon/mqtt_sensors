var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getMlx906Reading(callback) {
    var reading;
    exec('sudo /home/pi/projects/mqtt_reader/pi_reader/scripts/eye2c', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        if(reading){
            var obj = reading.split(',');
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piSerial#", 
                ok : true, 
                sensor : "Mlx906", 
                ambiTemp : obj[0].trim(),
                skyTemp : obj[1].trim()
            } 
        }
        console.log(objason);
        callback(null, objason, "Mlx906");
    });
}
