const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var sudo = require('sudo');
var fs = require('fs');

module.exports = function getSdp610Reading(callback) {
    var options = {
        cachePassword: true,
        prompt: 'mice',
        spawnOptions: { /* other options for spawn */ }
    };
    var child = sudo([ 'php', '/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php' ], options);
    let reading;
    //const child = spawn('php', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            callback(reading.trim());
            //console.log("sdp610******************************reding ok");
        }
    });
    
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'sdp610 err data: ' + data, function (err) {
        });
        console.log('sdp610 err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("sdp610 exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1000);
}
