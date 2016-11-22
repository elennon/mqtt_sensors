const uuid = require('node-uuid');
const exec = require('child_process').exec;
var sudo = require('sudo');
var fs = require('fs');

module.exports = function getSdp610Reading(callback) {
    var options = {
        cachePassword: true,
        prompt: 'mice',
        spawnOptions: { /* other options for spawn */ }
    };
    //var child = sudo([ 'php', '/home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php' ], options);
    let reading;
    
    exec('php /home/pi/projects/mqtt_reader/pi_reader/scripts/sdp.php' ,(error, stdout, stderr) => {
        if(error) {
            console.log('errrrrrror ' + error);
            callback(error);
        }
        var reading = `${stdout}`;
        let result = parseFloat(reading.trim());
        if(reading){
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piSerial#", 
                ok : true, 
                sensor : "Sdp610", 
                val : result
            }  
            console.log("sdp610***************************" + result);
            callback(null, objason, "Sdp610");
            //console.log("sdp610******************************reding ok");
        }
    });

}
