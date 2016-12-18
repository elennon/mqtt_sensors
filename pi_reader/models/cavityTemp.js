const uuid = require('node-uuid');
const spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function getCTReading(pi, callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_sensors/pi_reader/scripts/getcps.py']);
    
    child.stdout.on('data', function (data) {       
        reading = data.toString();
        if(reading){
            var objs = JSON.parse(reading);
            for (var obj in objs){
                var rdn = { 
                    createdAt : Date.now(), 
                    id : uuid.v4(), 
                    ip : pi.id, 
                    ok : true, 
                    sensor : "Cavity Temp: " + objs[obj].sensorId, 
                    val : objs[obj].val
                } 
                //console.log(objason);
                callback(null, rdn, "CavityTemp");
            }
        }
    });
    
    child.stderr.on('data', function (data) {
        fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'cavity temp error-- data: ' + data, function (err) {
        });
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        //console.log("Cavity temp read exited with code: " + exitCode);
    });

    setTimeout(function () {
        //console.log('**timeourtrt');
        child.kill();
    }, 9000);
}
