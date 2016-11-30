#! /usr/bin/python
# -*- coding: utf-8 -*-

import time

from bmp180 import bmp180
import uuid
import json
import paho.mqtt.client as mqtt
import sys

def on_connect(client, userdata, rc):
    print("Connected with result code {0}".format(rc))
    # Subscribe here to any topics that you are interested in

def main():
    print('connecting to mqtt')
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("139.59.172.240", 1884)
    print('connected')

    try:   
        while True:
            val = bmp180
            print val
            payload = {
                "id":str(uuid.uuid4()),
                "createdAt": time.time(),
                "ip":"piSerial#",
                "ok":"true",
                "sensor":"Bmp180",
                "val": 66
            }
            print (payload)
            client.publish('Bmp180', json.dumps(payload))
            time.sleep(1)
    except:
        print 'error'

if __name__ == '__main__':
    main()
