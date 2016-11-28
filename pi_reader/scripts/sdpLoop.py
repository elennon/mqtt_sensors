#! /usr/bin/python
# -*- coding: utf-8 -*-

"""
Sample app to asynchronously read out sensor values and stream the measurements over mqtt.
All sensors are polled on their own thread with individual polling frequencies.The program
blocks until cancelled by a keyboard interrupt.
"""
import time

from sensirion_sensors import find_sensor_by_type, SensorReader

import json
import paho.mqtt.client as mqtt
import signal
import socket
import sys

global lst = [];
global counter = 1;


def on_connect(client, userdata, rc):
    print("Connected with result code {0}".format(rc))
    # Subscribe here to any topics that you are interested in


def main():
    print('detecting sensors')
    sdp = find_sensor_by_type('sdp600')
    
    if not sdp:
        sys.stderr.writelines("couldn't find any sensors\n")
        return

    print('connecting to mqtt')
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("139.59.172.240", 1884)
    print('connected')

    def send_sensor_values(sensor, sensor_name, lst):
        print (lst)
        def send(timestamp, values):
            measurements = values.values()[0]
            if all(m is not None for m in measurements):
                val = measurements
                print(val)
                lst.append(val)
                if counter < 6 :
                    val = sum(lst)/len(lst)
                    payload = {
                        "_id":str(uuid.uuid4()),
                        "createdAt":1479334237370,
                        "id":"02599831-ef32-4a37-8b23-25cb45de841e",
                        "ip":"piSerial#",
                        "ok":"true",
                        "sensor":"Sdp610",
                        "val":val
                    }
                    client.publish('Sdp610', json.dumps(payload))
                    lst = []
        return send

    def signal_handler(signal, frame):
        print('terminating')
        client.disconnect()

    signal.signal(signal.SIGINT, signal_handler)

    try:   
        if sdp:
            sdp_reader = SensorReader((sdp,), 10, send_sensor_values(sdp, 'sdp', lst))
            sdp_reader.start()
        time.sleep(30)
        client.loop_stop()
        if sdp:
            sdp_reader.join()
    finally:
        client.loop_stop()
        if sdp:
            sdp_reader.join()


if __name__ == '__main__':
    main()
