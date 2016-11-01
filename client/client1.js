var mqtt = require('mqtt')

var options = {
    port: '1884',
    clientId: 'collsick',
    clean: false
};
var client = mqtt.connect('mqtt://localhost', options);

client.on('connect', function (connack) {
  console.log('bessee: ' + connack.returnCode);
  //client.subscribe('presence')
  for(var i = 0; i < 10; i ++){
    client.publish('Hflux', '{"createdAt":"\/Date(1476047352624)\/","id":"a065c415-b12e-4fd9-af52-7b51f6efb5f9","ip":"xxxyyy","message":null,"ok":false,"sensor":"hflux","val":-273.04}')
  }
})
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString())
  //client.end()
})

client.on('error', function (error) {
  // message is Buffer 
  console.log('in errorrrrr er ::::' + error);
})
