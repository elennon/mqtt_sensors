var mqtt = require('mqtt')
var uuid = require('node-uuid');
const exec = require('child_process').exec;
var counter = 1;

var options = {
    port: '1884',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
};
var client = mqtt.connect('mqtt://139.59.172.240', options);

client.on('error', function (error) {
    console.log('in errorrrrr er :::' + error);
})

function getBmp180Reading(callback) {
    var reading;
    exec('python /home/pi/projects/mqtt_reader/pi_client/scripts/bmp180.py', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
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
        callback(null, objason, "Bmp180");
    });
}

function getHfluxReading(callback) {
    var reading;
    exec('python /home/pi/projects/mqtt_reader/pi_client/scripts/bmp180.py', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        var obj = JSON.parse(reading);
        var objason = { 
            createdAt : Date.now(), 
            id : uuid.v4(), 
            ip : "piSerial#", 
            ok : true, 
            sensor : "Hflux", 
            val : 34.34
        } 
        callback(null, objason, "Hflux");
    });
}

function handleResult(err, result, collection) {
    if (err) {
        console.error(err.stack || err.message);
        return;
    }
    //console.log(collection + '.......................' + JSON.stringify(result));
    client.publish(collection, JSON.stringify(result));
    console.log('reading #' + counter);
}

function getresp(err, result){
    console.log('geterererehdpp' + result);
}

setInterval(function(){
    getBmp180Reading(handleResult);
    getHfluxReading(handleResult);
    counter++;
}, 1* 1000);


