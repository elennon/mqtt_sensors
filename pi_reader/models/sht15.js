var uuid = require('node-uuid');
const exec = require('child_process').exec;

module.exports = function getSht15Reading(callback) {
    var reading;
    exec('sudo python /usr/local/bin/sht -v -trd 4 17', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;      
        if(reading){
            var lines = reading.split('\n');
            for (var i = 0; i < lines.length; i ++){
                switch(lines[i].split(':')[0]){
                    case 'temperature' :
                        var temp = lines[i].split(':')[1];
                    case 'rh' :
                        var rh = lines[i].split(':')[1];
                    case 'dew_point' :
                        var dp = lines[i].split(':')[1];
                }
            }
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piSerial#", 
                ok : true, 
                sensor : "Sht15", 
                temperature : temp,
                rh : rh,
                dew_point : dp         
            } 
            //console.log(objason);
            callback(null, objason, "Sht15");
        }
    });
}
