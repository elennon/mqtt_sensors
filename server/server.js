var mosca = require('mosca')
 
var pubsubsettings = {
      type: 'mongo',
      url: 'mongodb://ed:mice@139.59.172.240:27017/Measurements',
      pubsubCollection: 'Hflux',
      mongo: {}
};
 
var settings = {
    port: 1883,
    backend: pubsubsettings
};

var server = new mosca.Server(settings);
server.on('ready', setup);

 
// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}

server.on('uncaughtException', function (err) {
    console.log(err);
}); 
 
// fired whena  client is connected
server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});
 
// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published: ', packet.topic);
});
 
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
    console.log('subscribed : ', topic);
});
 
// fired when a client unsubscribes to a topic
server.on('unsubscribed', function(topic, client) {
    console.log('unsubscribed : ', topic);
});
 
// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
    console.log('clientDisconnecting : ', client.id);
});
 
// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
    console.log('clientDisconnected : ', client.id);
});
