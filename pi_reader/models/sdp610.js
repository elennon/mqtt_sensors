const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var sudo = require('sudo');
var fs = require('fs');

module.exports = function getSdp610Reading(callback) {
    let reading;
    const child = spawn('python', ['//home/pi/libsensors-python/sdp.py']);
    child.stdout.on('data', function (data) {
    });
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'cavity temp error-- data: ' + data, function (err) {
        });
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("sdp read exited with code: " + exitCode);
    });
}
