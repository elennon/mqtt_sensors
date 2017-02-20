var mosca = require('mosca')
var monk = require('monk');
var db = monk('localhost:27017/Measurements');

var pubsubsettings = {
      type: 'mongo',
      url: 'mongodb://localhost:27017/Measurements',
      pubsubCollection: 'pubsub',
      mongo: {}
};
 
var settings = {
    port: 1884,
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
    var collection = null;       
    switch(packet.topic) {
        case "Hflux":
            collection = db.get('Hflux');   
            break;
        case "Bmp180":
            collection = db.get('Bmp180');   
            break;
        case "Mlx906":
            collection = db.get('Mlx906');   
            break;
        case "CavityTemp":
            collection = db.get('CavityTemp');   
            break;
        case "Sht15":
            collection = db.get('Sht15');   
            break;
        case "Sdp610":
            collection = db.get('Sdp610');   
            break;
        case "WeatherStation":
            collection = db.get('WeatherStation');     
            break;
        case "Pi":
            collection = db.get('Pi');   
            break;
        case "Building":
            collection = db.get('Building');   
            break;
    } 
    if(collection !== null){
        var rd = JSON.parse(packet.payload);
        if(packet.topic !== "WeatherStation"){
            rd.createdAt = Date.now();
        } else if (packet.topic === "WeatherStation"){
            rd.time = Date.now();
        }
        collection.insert(rd, function (err, doc) {
            if (err) {
                // If it failed, return error
                console.log("There was a problem adding the information to the database.");
            }
        });
        console.log('Published: ', packet.topic);
    }
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
