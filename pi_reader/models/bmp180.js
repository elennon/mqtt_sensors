var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getBmp180Reading(callback) {
    var reading;
    exec('python /home/pi/projects/mqtt_reader/pi_reader/scripts/adaBmp.py', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        var obj = JSON.parse(reading);
        var objason = { 
            createdAt : Date.now(), 
            id : uuid.v4(), 
            ip : "piserial#", 
            message : "xvvxvx",
            ok : true, 
            sensor : "Bmp180", 
            temp : obj.temp,
            pressure : obj.pressure
        } 
        //console.log(objason);
        callback(null, objason, "Bmp180");
    });
}
