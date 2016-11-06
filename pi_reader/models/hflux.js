var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getHfluxReading(callback) {
    var reading;
    try {
        exec('python /home/pi/projects/mqtt_reader/pi_reader/scripts/hflux.py', (error, stdout, stderr) => {
            if (error) {
                return callback(error);
            }
            reading = `${stdout}`;
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
            }
            //console.log(objason);
            callback(null, objason, "Hflux");
        });
    } 
    catch (err) {
        console.log('hflux error: ' + err);
    }
}
