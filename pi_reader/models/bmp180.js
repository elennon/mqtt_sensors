const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function getBmp180Reading(pi, callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_sensors/pi_reader/scripts/adaBmp.py']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            var obj = JSON.parse(reading);
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : pi.id, 
                ok : true, 
                sensor : "Bmp180", 
                temp : obj.temp,
                pressure : obj.pressure
            } 
            //console.log('allgoode--bmopp', objason);
            callback(null, objason, "Bmp180");
        }
    });
    
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'bmp 180 error-- data: ' + data, function (err) {
        });
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("bmp180 read exited with code: " + exitCode);
    });

    setTimeout(function () {
        //console.log("kilt");
        child.kill();
    }, 1500);
}
