#! /usr/bin/python
# -*- coding: utf-8 -*-
from w1thermsensor import W1ThermSensor
import Adafruit_ADS1x15
import time
import uuid
import json
import paho.mqtt.client as mqtt
import sys

output = []

print json.dumps(output)

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
            for sensor in W1ThermSensor.get_available_sensors([W1ThermSensor.THERM_SENSOR_DS18B20]):
                payload = {
                    "id": str(uuid.uuid4()),
                    "createdAt": time.time(),
                    "ip":"piSerial#",
                    "ok":"true",
                    "sensor": sensor.id,
                    "val": sensor.get_temperature()
                }
                print (payload)
                client.publish('Hflux', json.dumps(payload))
            time.sleep(10)
    except Exception:
        print Exception.message

if __name__ == '__main__':
    main()


