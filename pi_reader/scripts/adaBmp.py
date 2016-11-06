#!/usr/bin/python


import Adafruit_BMP.BMP085 as BMP085
import json

sensor = BMP085.BMP085()
temp = 'Temp = {0:0.2f}'.format(sensor.read_temperature())
pressure = 'Pressure = {0:0.2f}'.format(sensor.read_pressure())
obj = { "temp" : temp, "pressure" : pressure }
print json.dumps(obj)

