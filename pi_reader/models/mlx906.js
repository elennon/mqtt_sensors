const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var sudo = require('sudo');
var options = {
    cachePassword: true,
    prompt: 'mice',
    spawnOptions: { /* other options for spawn */ }
};
module.exports = function getMlx906Reading(callback) {
    let reading;

    var schild = sudo([ 'home/pi/projects/mqtt_reader/pi_reader/scripts/eye2c'], options);
    schild.stdout.on('data', function (data) {
        console.log('sudo workd', data.toString());
    });

    const child = spawn('/home/pi/projects/mqtt_reader/pi_reader/scripts/eye2c');

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
        console.log('Mlx906 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("Mlx906 read exited with code: " + exitCode);
    });
}
