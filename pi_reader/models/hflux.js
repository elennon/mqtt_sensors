const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getMlx906Reading(callback) {
    const reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/hflux.py']);

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
        console.log('hflux err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("hflux exited with code: " + exitCode);
    });
}






