const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function getMlx906Reading(callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_sensors/pi_reader/scripts/hflux.py']);
    
    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            var obj = JSON.parse(reading);
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piSerial#", 
                ok : true, 
                sensor : "Hflux", 
                val : obj.val
            }             
            //console.log(objason);
            callback(null, objason, "Hflux");
        }
    });
    
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'hflux error-- data: ' + data, function (err) {
        });
        console.log('hflux err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("hflux exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1500);
}






