
#! /usr/bin/python
# -*- coding: utf-8 -*-
 
"""
Sample app to asynchronously read out sensor values and stream the measurements over mqtt.
 
All sensors are polled on their own thread with individual polling frequencies.The program
blocks until cancelled by a keyboard interrupt.
"""
import time
import json
import paho.mqtt.client as mqtt
import signal
import socket
import sys
import uuid
 
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

def getraeding(counter):
    return counter

def send(lst, counter, client):
    topic = 'Spd610'
    print counter
    print('(((((((((((((((((2)))))))))))))))))')
    #measurements = 0.99
    lst.append(counter)
    if counter < 6 :  
        print 'counter'
        payload = {
            "createdAt" : time.strftime("%H:%M:%S"), 
            "id" : uuid.uuid4().int, 
            "ip" : "piSerial#", 
            "ok" : True, 
            "sensor" : "Sdp610", 
            "val" : 66.77
        }
        print payload
        client.publish(topic, json.dumps(payload))

def main():
    print('detecting sensors')
    lst = [];
    counter = 1
    #sdp = find_sensor_by_type('sdp600')
   
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("139.59.172.240", 1884)
    print('connected')
    
    try:
        print('furtt')
        for x in range(0, 6):
            print "We're on time %d" % (x)
            rd = getraeding(counter)
            lst.append(rd)
            print lst
            counter += 1
            #send(lst, counter, client)
            time.sleep(4)
        print sum(lst)/len(lst)
    finally:
        print "done"
 
if __name__ == '__main__':
    main()