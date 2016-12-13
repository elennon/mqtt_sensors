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
var cluster = require('cluster');

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

if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function(worker) {
        console.log('Worker %d died', worker.id);
        cluster.fork();
    });
} else if (cluster.isWorker) { 
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
    	console.log('Worker %d running!', cluster.worker.id);
    	process.on('exit', function() {
      		console.log('Handled the exception here');
      		process.exit(1);
    	});
}

client.on('error', function (error) {
	fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'main js error-- data: ' + data, function (err) {
        });
    	console.log('in errorrrrr ********************' + error);
});
