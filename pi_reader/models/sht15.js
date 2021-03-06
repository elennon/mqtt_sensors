const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function getSht15Reading(pi, callback) {
    var reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_sensors/pi_reader/scripts/sht.py', '-v', '-trd', '4', '17']);

    child.stdout.on('data', function (data) {
        reading = data.toString();
        if(reading){
            var lines = reading.split('\n');
            for (var i = 0; i < lines.length; i ++){
                switch(lines[i].split(':')[0]){
                    case 'temp' :
                        var temp = lines[i].split(':')[1].trim();
                    case 'rh' :
                        var rh = lines[i].split(':')[1].trim();
                }
            }
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : pi.id, 
                ok : true, 
                sensor : "Sht15", 
                temperature : temp,
                rh : rh
            } 
            //console.log(objason);
            callback(null, objason, "Sht15");
        }
    });
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_reader/mqtt_sensors/errorLog.txt', 'sht15 error-- data: ' + data, function (err) {
        });
        console.log('sht15 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("sht15 read exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 3000);
}
