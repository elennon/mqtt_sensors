var mqtt = require('mqtt')
var uuid = require('node-uuid');
var hflux = require('./models/hflux.js');
var bmp180 = require('./models/bmp180.js');
var cavityTemp = require('./models/cavityTemp.js');
var mlx906 = require('./models/mlx906.js');
var sdp610 = require('./models/sdp610.js');
var sht15 = require('./models/sht15.js');

var counter = 1;

var options = {
    port: '1884',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
};
var client = mqtt.connect('mqtt://139.59.172.240', options);

function handleResult(err, result, collection) {
    if (err) {
        console.error(err.stack || err.message);
        return;
    }
    //console.log(collection + '.......................' + JSON.stringify(result));
    client.publish(collection, JSON.stringify(result));
    console.log('reading #' + counter);
}

setInterval(function(){
      bmp180(handleResult);
      hflux(handleResult);
      cavityTemp(handleResult);
      mlx906(handleResult);
      sdp610(handleResult);
      sht15(handleResult);
      counter++;
  }, 1* 10000);

client.on('error', function (error) {
  console.log('in errorrrrr er :::' + error);
})