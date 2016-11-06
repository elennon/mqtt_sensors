var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getMlx906Reading(callback) {
    var reading;
    exec('php /home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        
        //console.log('val isssssss' + val);
        callback(reading.trim());
    });
}
