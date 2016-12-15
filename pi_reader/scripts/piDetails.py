#! /usr/bin/python
# -*- coding: utf-8 -*-
import time
import uuid
import json
import paho.mqtt.client as mqtt
import sys
import os

def display_title_bar():
    # Clears the terminal screen, and displays a title bar.
    os.system('clear')
    print("\t**********************************************")
    print("\t*** Setting up the pi details  ***")
    print("\t**********************************************")

def getserial():
  cpuserial = "0000000000000000"
  try:
    f = open('/proc/cpuinfo','r')
    for line in f:
      if line[0:6]=='Serial':
        cpuserial = line[10:26]
    f.close()
  except:
    cpuserial = "ERROR000000000"
  return cpuserial

def on_connect(client, userdata, rc):
    print("Connected with result code {0}".format(rc))
    
def main():
    display_title_bar()
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("139.59.172.240", 1884)
    print('connected')
    name = raw_input("What name do want to give this pi? ")
    location = "44 oak lawn"
    description = raw_input("What description? ")
    myserial = getserial()
    try:   
        payload = {
            "id" : getserial(),
            "createdAt" : time.time(),
            "name" : name,
            "description" : description,
            "location" : location
        }
        print (payload)
        client.publish('Pi', json.dumps(payload))
    except Exception:
        print Exception.message

if __name__ == '__main__':
    main()