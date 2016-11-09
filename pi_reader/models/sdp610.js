const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getSdp610Reading(callback) {
    const reading;
    const child = spawn('php', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            callback(reading.trim());
        }
    });
    
    child.stderr.on('data', function (data) {
        console.log('sdp610 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("sdp610 exited with code: " + exitCode);
    });
}