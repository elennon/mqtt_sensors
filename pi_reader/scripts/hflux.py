
import time
import Adafruit_ADS1x15
import json

adc = Adafruit_ADS1x15.ADS1115()
GAIN = 16
# Read all the ADC channel values in a list.
value = adc.read_adc(1, gain=GAIN)
print json.dumps( { "val" : value } )
#print ('%s' % value)
