var mosca = require('mosca')
 
var pubsubsettings = {
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'myCollections',
  mongo: {}
};
 
var settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};
 
var server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running')
});

server.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }
 
  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };
 
  console.log('newPacket', newPacket);
  
  server.publish(newPacket, cb);
}
server.on('ready', setup);

// Accepts the connection if the username and password are valid
var authenticate = function(client, username, password, callback) {
  var authorized = (username === 'me' && password.toString() === 'secret');
  if (authorized) client.user = username;
  callback(null, authorized);
}
 
// fired when the mqtt server is ready
function setup() {
  server.authenticate = authenticate;
  console.log('Mosca server is up and running')
}
 
// fired whena  client is connected
server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});
 
// fired when a message is received
server.on('published', function(packet, client) {
  //console.log('packeeeeeeeeeeeert: ' + JSON.parse(packet).toString());
  //console.log('clieneeeeeeeeeeert: ' + JSON.parse(client).toString());
  console.log('Published : ', packet.payload);
});
 
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic);
});
 
// fired when a client subscribes to a topic
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
