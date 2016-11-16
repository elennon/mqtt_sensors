const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var sudo = require('sudo');

module.exports = function getSdp610Reading(callback) {
    
    var options = {
        cachePassword: true,
        prompt: 'mice',
        spawnOptions: { /* other options for spawn */ }
    };
    var schild = sudo([ 'php', '/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php' ], options);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    let reading;
    const child = spawn('php', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            callback(reading.trim());
        }
    });
    
    child.stderr.on('data', function (data) {
        if (data.toString().indexOf('Write failed')) {
            child.kill();
        }
        console.log('sdp610 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("sdp610 exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1500);
}
