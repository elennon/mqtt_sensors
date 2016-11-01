var mqtt = require('mqtt')
const exec = require('child_process').exec;
var counter = 1;

var options = {
    port: '1883',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
};
var client = mqtt.connect('mqtt://139.59.172.240', options);

client.on('error', function (error) {
    console.log('in errorrrrr er :::' + error);
})

function getReading(callback) {
    var reading;
    exec('python /home/pi/projects/mqtt_client/bmp180.py', (error, stdout, stderr) => {
        if (error) {
            return callback(error);
        }
        reading = `${stdout}`;
        callback(null, reading);
    });
}

function handleResult(err, result) {
    if (err) {
        console.error(err.stack || err.message);
        return;
    }
    var obj = JSON.parse(result);
    var jjs = { 
        createdAt : "\/Date(1476047352624)\/", 
        id : "jjjjjjjj", 
        ip : "vvvxx", 
        ok : "si, ok", 
        sensor : "Hflux", 
        value : 333.3
    }
    client.publish('Hflux', JSON.stringify(jjs));
    //client.publish('Hflux', Json.stringify(jjs), { qos: 0, retain: false}, function() {
    //});    
    //client.publish('altitude', obj.altitude.toString());
    //client.publish('temp', obj.temp.toString());
    console.log('reading #' + counter);
}

function getresp(err, result){
    console.log('geterererehdpp' + result);
}

setInterval(function(){
    getReading(handleResult);
    counter++;
}, 1* 1000);


