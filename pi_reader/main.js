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

memwatch.on('leak', function(info) {
    fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'memory leak -- info: ' + leak, function (err) {
        });
        console.error('memory leak: ' + info);
});

function onFileRead(err, data) {  
    if (err) throw err;
    var pidetails = JSON.parse(data);
    if(!pidetails.name || pidetails.name == ""){
	console.log('********** need to get pi info');
        getPi(saveInfo);
    } else {
	console.log('********** have pi info');
        runn(null, pidetails);
    }
}

function saveInfo(err, pi){
	var jason = JSON.stringify(pi);
	fs.writeFile('/home/pi/projects/mqtt_sensors/pi_reader/pi_details.json', jason, 'utf8');
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
    //console.log(JSON.stringify(result));
    console.log('reading #' + counter + '  ... ' + result.sensor);
}

function runn(err, pi) {
	console.log('********** starting reads');
        //console.log(pi);
	setInterval(function(){
		suspend(function* () {
			// //sendSdpAvg(handleResult);
			sdp610(pi, handleResult);
			yield setTimeout(suspend.resume(), 10000);
			bmp180(pi, handleResult);
			yield setTimeout(suspend.resume(), 10000); 
			//mlx906(pi, handleResult);
			yield setTimeout(suspend.resume(), 10000); 
			//hflux(pi, handleResult);
			yield setTimeout(suspend.resume(), 10000);
			cavityTemp(pi, handleResult);
			yield setTimeout(suspend.resume(), 10000);
			sht15(pi, handleResult);
		})();		
		counter++;
	}, 1* 60000);
	console.log('Worker %d running!', cluster.worker.id);
	process.on('exit', function(err) {
		console.log('error: ' + err);
		process.exit(1);
	});
}

if (cluster.isMaster) {
	cluster.fork();
	cluster.on('exit', function(worker) {
		console.log('Worker %d died', worker.id);
		cluster.fork();
	});
} else if (cluster.isWorker) { 
	console.log('********** reading pi details file');
	fs.readFile('/home/pi/projects/mqtt_sensors/pi_reader/pi_details.json', 'utf8', onFileRead);
}

client.on('error', function (error) {
	fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'main js error-- data: ' + data, function (err) {
        });
    	console.log('in errorrrrr ********************' + error);
});
