const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getBmp180Reading(callback) {
    const reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/adaBmp.py']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
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
            callback(null, objason, "Bmp180");
        }
    });
    
    child.stderr.on('data', function (data) {
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("Child exited with code: " + exitCode);
    });
}
