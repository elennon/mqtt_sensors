const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function getCTReading(callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/getcps.py']);
    
    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
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
        }
    });
    
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'cavity temp error-- data: ' + data, function (err) {
        });
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("Cavity temp read exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1500);
}
