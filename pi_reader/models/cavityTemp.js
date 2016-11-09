const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getCTReading(callback) {
    const reading;
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
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("Child exited with code: " + exitCode);
    });
}