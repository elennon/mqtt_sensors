const uuid = require('node-uuid');
var sudo = require('sudo');
var options = {
    cachePassword: true,
    prompt: 'mice'
};

module.exports = function getSht15Reading(callback) {
    let reading;
    var schild = sudo('home/pi/projects/mqtt_reader/pi_reader/scripts/eye2c');
    schild.stdout.on('data', function (data) {
        reading = data.toString();   
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
