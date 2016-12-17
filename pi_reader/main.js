var mqtt = require('mqtt')
var uuid = require('node-uuid');
var hflux = require('./models/hflux.js');
var bmp180 = require('./models/bmp180.js');
var cavityTemp = require('./models/cavityTemp.js');
var mlx906 = require('./models/mlx906.js');
var sdp610 = require('./models/sdp610.js');
var sht15 = require('./models/sht15.js');
var getPi = require('./models/getPiInfo.js');
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

function onFileRead(err, data) {  
    if (err) throw err;
    var pidetails = JSON.parse(data);
    console.log(data );
    console.log('two' );
    if(data == '{}'){
		console.log('not  else');
        getPi(saveInfo);
    } else {
		console.log('else');
		console.log(pidetails);
        runn(pidetails);
    }
}

function saveInfo(err, pi){
	console.log('savnnn info');
	var jason = JSON.stringify(pi);
	fs.writeFile('/home/ed/projects/node_js/mqtt_sensors/pi_reader/pi_details.json', jason, 'utf8');
	client.publish('Pi', jason);
	runn(null, pi);
}

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

function runn(err, pi) {  
	setInterval(function(){
			suspend(function* () {
		// //sendSdpAvg(handleResult);
		// sdp610(handleResult);
		// yield setTimeout(suspend.resume(), 10000);
		// bmp180(handleResult);
		// yield setTimeout(suspend.resume(), 10000); 
		// //mlx906(handleResult);
		// yield setTimeout(suspend.resume(), 10000); 
		// hflux(handleResult);
		// yield setTimeout(suspend.resume(), 10000);
		// cavityTemp(handleResult);
		// yield setTimeout(suspend.resume(), 10000);
		// sht15(handleResult);
		console.log('mc55' + pi.name)
		})();
		
		counter++;
	}, 1* 1000);
	console.log('Worker %d running!', cluster.worker.id);
	process.on('exit', function() {
		console.log('Handled the exception here');
		process.exit(1);
	});
}

console.log('runnnnn');
if (cluster.isMaster) {
	cluster.fork();
	cluster.on('exit', function(worker) {
		console.log('Worker %d died', worker.id);
		cluster.fork();
	});
} else if (cluster.isWorker) { 
	console.log('one');
	fs.readFile('/home/ed/projects/node_js/mqtt_sensors/pi_reader/pi_details.json', 'utf8', onFileRead);
}

client.on('error', function (error) {
	fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'main js error-- data: ' + data, function (err) {
        });
    	console.log('in errorrrrr ********************' + error);
});
