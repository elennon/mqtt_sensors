
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
 
 
def on_connect(client, userdata, rc):
    print("Connected with result code {0}".format(rc))
    # Subscribe here to any topics that you are interested in
 
 
def main():
    print('detecting sensors')
   
    #sdp = find_sensor_by_type('sdp600')
    lst = [];
    counter = 0
   
    print('connecting to mqtt')
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("http://139.59.172.240", "1884")
 
    def send_sensor_values(sensor, sensor_name):
        topic = 'Spd610'
       
        def send(timestamp, values):
            measurements = 0.99
            lst[counter] = measurements
            if counter < 6 :  
                payload = {
                    "createdAt":1479334417414,
                    "id":"e33dc46d-b8dc-44c5-89c1-83764575e3de",
                    "ip":"piSerial#",
                    "ok":true,
                    "sensor":"Sdp610",
                    "val":-49.666666666
                }
                client.publish(topic, json.dumps(payload))
                counter += 1
            else:
                counter += 1
        return send
 
    def signal_handler(signal, frame):
        print('terminating')
        client.disconnect()
 
    print('(((((((((((((((((9)))))))))))))))))')
 
    signal.signal(signal.SIGINT, signal_handler)
 
    try:
        for x in range(0, 5):
            print "We're on time %d" % (x)
            send_sensor_values(sdp, 'sdp')
            time.sleep(10)
       
    finally:
        print "done"
 
if __name__ == '__main__':
    main()