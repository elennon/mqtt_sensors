const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getMlx906Reading(callback) {
    const reading;
    const child = spawn('python', ['sudo /home/pi/projects/mqtt_reader/pi_reader/scripts/eye2c']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
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
            //console.log(objason);
            callback(null, objason, "Mlx906");
        }      
    });
    
    child.stderr.on('data', function (data) {
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("Child exited with code: " + exitCode);
    });
}