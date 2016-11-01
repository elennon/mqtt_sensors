
var mqtt = require('mqtt')

var options = {
    port: '1884',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    clean: false,
    username: 'me',
    password: 'secret',
};
var client = mqtt.connect('mqtt://10.142.11.13', options);

client.on('connect', function (connack) {
    client.subscribe('temp')
})
 
client.on('message', function (topic, message) {
    console.log('temperature', message.toString())
})

client.on('error', function (error) {
    console.log('Error: ' + error);
})
