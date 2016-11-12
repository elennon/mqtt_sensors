const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getSht15Reading(callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/sht.py', '-v', '-trd', '4', '17']);

    child.stdout.on('data', function (data) {
        reading = data.toString();   
        if(reading){
            var lines = reading.split('\n');
            for (var i = 0; i < lines.length; i ++){
                switch(lines[i].split(':')[0]){
                    case 'temperature' :
                        var temp = lines[i].split(':')[1];
                    case 'rh' :
                        var rh = lines[i].split(':')[1];
                    case 'dew_point' :
                        var dp = lines[i].split(':')[1];
                }
            }
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piSerial#", 
                ok : true, 
                sensor : "Sht15", 
                temperature : temp,
                rh : rh,
                dew_point : dp         
            } 
            //console.log(objason);
            callback(null, objason, "Sht15");
        }
    });
    child.stderr.on('data', function (data) {
        console.log('sht15 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("sht15 read exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1500);
}
