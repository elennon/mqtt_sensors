import paho.mqtt.client as mqtt
import sys
import time
import datetime
import serial
import urllib
import urllib2
import logging

url='http://richview.ucd.ie/weatherStationMeasurement.php'

ser=serial.Serial(
	port='/dev/ttyUSB0',
	baudrate=19200,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=5
)
client = mqtt.Client()
client.on_connect = on_connect
client.connect("139.59.172.240", 1884)
print('connected')
while 1:
	y=0
	str=""
	while y<200:
		x=ser.read().strip()
		str=str+x
		y=y+1
		if(x==""):
			break
	
	if len(str)>0:
		print "Timestamp: {}".format(time.time())
		print "Datetime: "+datetime.datetime.now().strftime("%c")
		print str

		payload={'data':str,'timestamp':time.time()}
		try:
			req = urllib2.Request(url,urllib.urlencode(payload))
			response=urllib2.urlopen(req)
			print "Response: "+response.read()
			resp = response.read().split(',')
			payload = {
                            "id": str(uuid.uuid4()),
                            "createdAt": resp[0],
                            "wind_direction" : resp[0]
                        }
                
                        client.publish('WeatherStation', json.dumps(payload))
		except urllib2.HTTPError, err:
			print "HTTPError: ", err.code
			logging.info("***HTTPError: %d" % err.code)
		except urllib2.URLError, err:
			print "URLError:", err.reason
			logging.info("***URLError: %s" % err.reason)

		print ""
