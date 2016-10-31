var mqtt = require('mqtt')

var options = {
    port: '1883',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    clean: false,
    username: 'nme',
    password: 'secret',
};
var client = mqtt.connect('mqtt://localhost', options);

client.on('connect', function (connack) {
  console.log('bessee: ' + connack.returnCode);
  //client.subscribe('presence')
  client.publish('presednce', 'Hello mqttesssssssssssssss')
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
})

client.on('error', function (error) {
  // message is Buffer 
  console.log('in errorrrrr er :::' + error);
})
