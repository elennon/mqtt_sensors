var mqtt = require('mqtt')
var uuid = require('node-uuid');
var sht15 = require('./models/sht15.js');
var suspend = require('suspend');
var fs = require('fs');
var memwatch = require('memwatch-next');

var counter = 1;
var sdpArray = [];

var options = {
    port: '1884',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
};
var client = mqtt.connect('mqtt://139.59.172.240', options);
console.log('process:-->   ', process.pid);

memwatch.on('leak', function(info) {
    fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'memory leak -- info: ' + leak, function (err) {
        });
        console.error('memory leak: ' + info);
});

function handleResult(err, result, collection) {
    if (err) {
        fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'handleResult error-- error: ' + err, function (err) {
        });
        console.error(err.stack || err.message);
        return;
    }
    //console.log(collection + '.......................' + JSON.stringify(result));
    client.publish(collection, JSON.stringify(result));
    console.log('reading #' + counter + '  ... ' + result.sensor);
}

setInterval(function(){
    suspend(function* () {
        yield setTimeout(suspend.resume(), 10000);
        sht15(handleResult);
    })();
    counter++;
}, 1* 10000);

client.on('error', function (error) {
    fs.appendFile('/home/pi/projects/mqtt_reader/pi_reader/errorLog.txt', 'main js error-- data: ' + data, function (err) {
        });
    console.log('in errorrrrr ********************' + error);
});
