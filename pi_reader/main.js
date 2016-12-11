var mqtt = require('mqtt')
var uuid = require('node-uuid');
var hflux = require('./models/hflux.js');
var bmp180 = require('./models/bmp180.js');
var cavityTemp = require('./models/cavityTemp.js');
var mlx906 = require('./models/mlx906.js');
var sdp610 = require('./models/sdp610.js');
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
//sdp610(handleResult);
//sht15(handleResult);

memwatch.on('leak', function(info) {
    fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'memory leak -- info: ' + leak, function (err) {
        });
        console.error('memory leak: ' + info);
});

function handleResult(err, result, collection) {
    if (err) {
        fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'handleResult error-- error: ' + err, function (err) {
        });
        console.error(err.stack || err.message);
        return;
    }
    //console.log(collection + '.......................' + JSON.stringify(result));
    client.publish(collection, JSON.stringify(result));
    console.log('reading #' + counter + '  ... ' + result.sensor);
}

function addSdpVal(val){
    sdpArray.push(val);
}

function sendSdpAvg(callback){
    var objason = { 
        createdAt : Date.now(), 
        id : uuid.v4(), 
        ip : "piSerial#", 
        ok : true, 
        sensor : "Sdp610", 
        val : getSdpAvg()
    }  
    sdpArray = [];
    //console.log(objason);
    callback(null, objason, "Sdp610");
}

function getSdpAvg(){
    var sum = 0;
    for( var i = 0; i < sdpArray.length; i++ ) {
        sum += parseFloat( sdpArray[i]);
    }
    return sum / sdpArray.length;
}

//setInterval(function(){
    //sdp610(addSdpVal);
//}, 1* 6000);

setInterval(function(){
    suspend(function* () {
	//sendSdpAvg(handleResult);
        sdp610(handleResult);
        yield setTimeout(suspend.resume(), 10000);
        bmp180(handleResult);
	yield setTimeout(suspend.resume(), 10000); 
        //mlx906(handleResult);
        yield setTimeout(suspend.resume(), 10000); 
        hflux(handleResult);
        yield setTimeout(suspend.resume(), 10000);
        cavityTemp(handleResult);
        yield setTimeout(suspend.resume(), 10000);
        sht15(handleResult);
    })();
    counter++;
}, 1* 60000);


client.on('error', function (error) {
    fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'main js error-- data: ' + data, function (err) {
        });
    console.log('in errorrrrr ********************' + error);
});
