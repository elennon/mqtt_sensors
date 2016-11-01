var mqtt = require('mqtt');
const exec = require('child_process').exec;
var counter = 1;
var date = new Date();
var time;

var options = {
    port: '22883',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'me',
    password: 'secret',
};
var client = mqtt.connect('tcp://10.142.58.48', options);

client.on('error', function (error) {
    console.log('ERROR: ' + error);
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
    time = date.getHours();
    var obj = JSON.parse(result);
    client.publish('pressure', obj.pressure.toString(), { qos: 1, retain: false });
    client.publish('altitude', obj.altitude.toString(), { qos: 1, retain: false });
    client.publish('temp', obj.temp.toString(), { qos: 1, retain: false });
    console.log(getDateTime() + ':  temp: ' + obj.temp.toString()  + ', pressure: ' + obj.pressure.toString() + ', altitude: ' + obj.altitude.toString());
}

function getresp(err, result){
    console.log('get response: ' + result);
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

setInterval(function(){
    getReading(handleResult);
    counter++;
}, 5* 1000);


