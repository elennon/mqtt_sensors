import paho.mqtt.client as mqtt
import time
import json
import signal
import socket
import sys
import uuid

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" nnn  "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("139.59.172.240", 1884, 60)
payload = {
	"_id":"662cd95d51b09ccd36ae3b22",
	"createdAt":1479334237370,
	"id":"02599831-ef32-4a37-8b23-25cb45de841e",
	"ip":"piSerial#",
	"ok":"true",
	"sensor":"Sdp610",
	"val":-666
}

client.publish("Sdp610", json.dumps(payload))

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()