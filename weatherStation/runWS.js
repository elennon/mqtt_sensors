var cluster = require('cluster');
const spawn = require('child_process').spawn;

function run() {
	const child = spawn('python', ['/home/ed/projects/node_js/mqtt_sensors/weatherStation/weatherStation.py']);
    console.log('HHHHHHHHHHHHHHHHHHHHHHHHHH');
    child.on('exit', function (exitCode) {
        fs.appendFile('/home/pi/projects/mqtt_sensors/pi_reader/errorLog.txt', 'weather station error-- data: ', function (err) {
        });
        console.log('hflux err data: ' + data);
    });
}

if (cluster.isMaster) {
	cluster.fork();
	cluster.on('exit', function(worker) {
		console.log('Worker %d died', worker.id);
		cluster.fork();
	});
} else if (cluster.isWorker) { 
	console.log('********** reading weather station');
	run();
}