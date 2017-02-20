import paho.mqtt.client as mqtt
import sys
import time
import datetime
import serial
import urllib
import urllib2
import logging
import uuid
import json
import sys

url='http://richview.ucd.ie/weatherStationMeasurement.php'

ser=serial.Serial(
	port='/dev/ttyUSB0',
	baudrate=19200,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=5
)

def on_connect(client, userdata, rc):
    print("Connected with result code {0}".format(rc))

    
client = mqtt.Client()
client.on_connect = on_connect
client.connect("139.59.172.240", 1884)
print('connected')
while 1:
	y=0
	strr=""
	while y<200:
		x=ser.read().strip()
		strr=strr+x
		y=y+1
		if(x==""):
			break
	
	if len(strr)>0:
		print "Timestamp: {}".format(time.time())
		print "Datetime: "+datetime.datetime.now().strftime("%c")
		#print strr

		#payload={'data':str,'timestamp':time.time()}
		try:
                        resp = strr.split(',')
                        if len(resp) == 14:
                                payload = {
                                    "id": str(uuid.uuid4()),
                                    "wind_direction" : resp[1],
                                    "wind_speed" : resp[2],
                                    "corrected_direction" : resp[3],
                                    "pressure" : parseFloat(resp[4]) * 133.322365,
                                    "rh%" : resp[5],
                                    "temp" : resp[6],
                                    "dew_point" : resp[7],
                                    "precipitation" : resp[8],
                                    "precipitation_intensity" : resp[9],
                                    "time" : resp[10],
                                    "volys" : resp[11],
                                    "status" : resp[12],
                                    "check" : resp[13]
                                }
                                print payload
                                client.publish('WeatherStation', json.dumps(payload))
			
		except urllib2.HTTPError, err:
			print "HTTPError: ", err.code
			logging.info("***HTTPError: %d" % err.code)
		except urllib2.URLError, err:
			print "URLError:", err.reason
			logging.info("***URLError: %s" % err.reason)

		print ""
