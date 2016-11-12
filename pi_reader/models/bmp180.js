const uuid = require('node-uuid');
const spawn = require('child_process').spawn;

module.exports = function getBmp180Reading(callback) {
    let reading;
    const child = spawn('python', ['/home/pi/projects/mqtt_reader/pi_reader/scripts/adaBmp.py']);

    child.stdout.on('data', function (data) {       
        reading = data.toString();
        console.log('thts dat :', reading);
        if(reading){
            var obj = JSON.parse(reading);
            var objason = { 
                createdAt : Date.now(), 
                id : uuid.v4(), 
                ip : "piserial#", 
                message : "xvvxvx",
                ok : true, 
                sensor : "Bmp180", 
                temp : obj.temp,
                pressure : obj.pressure
            } 
            //console.log('allgoode--bmopp', objason);
            callback(null, objason, "Bmp180");
        }
    });
    
    child.stderr.on('data', function (data) {
        console.log('err data: ' + data);
    });

    child.on('exit', function (exitCode) {
        console.log("bmp180 read exited with code: " + exitCode);
    });

    setTimeout(function () {
        child.kill();
    }, 1500);
}
