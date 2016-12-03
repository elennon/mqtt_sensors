#! /usr/bin/python
# -*- coding: utf-8 -*-

import Adafruit_ADS1x15
import time
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
            adc = Adafruit_ADS1x15.ADS1115()
            GAIN = 16
            # Read all the ADC channel values in a list.
            value = adc.read_adc(1, gain=GAIN)
            print ('%s' % value)
            payload = {
                "id": str(uuid.uuid4()),
                "createdAt": time.time(),
                "ip":"piSerial#",
                "ok":"true",
                "sensor":"Hflux",
                "val": value
            }
            print (payload)
            client.publish('Hflux', json.dumps(payload))
            time.sleep(10)
    except Exception:
        print Exception.message

if __name__ == '__main__':
    main()



