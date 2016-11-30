#! /usr/bin/python
# -*- coding: utf-8 -*-

"""
Sample app to asynchronously read out sensor values and stream the measurements over mqtt.
All sensors are polled on their own thread with individual polling frequencies.The program
blocks until cancelled by a keyboard interrupt.
"""
import time

from sensirion_sensors import find_sensor_by_type, SensorReader
import uuid
import json
import paho.mqtt.client as mqtt
import signal
import socket
import sys

lst = []
counter = 0

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

    def send_sensor_values(sensor, sensor_name):
        def send(timestamp, values):
            global lst, counter
            measurements = values.values()[0]
            if all(m is not None for m in measurements):
                val = measurements[0]
                lst.append(val)
                print (counter)
                if counter == 6 :
                    val = sum(lst)/len(lst)
                    payload = {
                        "id":str(uuid.uuid4()),
                        "createdAt": time.time(),
                        "ip":"piSerial#",
                        "ok":"true",
                        "sensor":"Sdp610",
                        "val":val
                    }
                    print (payload)
                    client.publish('Sdp610', json.dumps(payload))
                    lst = []
                    counter = 0
                counter += 1
        return send

    def signal_handler(signal, frame):
        print('terminating')
        client.disconnect()

    signal.signal(signal.SIGINT, signal_handler)

    try:   
        if sdp:
            lst = []
            counter = 0
            sdp_reader = SensorReader((sdp,), (1), send_sensor_values(sdp, 'sdp'))
            sdp_reader.start()
        client.loop_forever()
    finally:
        client.loop_stop()
        if sdp:
            sdp_reader.join()


if __name__ == '__main__':
    main()
