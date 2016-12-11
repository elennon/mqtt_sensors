#!/usr/bin/python

from sht_sensor import Sht
sht = Sht(4, 17)
print "temp", sht.read_t()
print "rh", sht.read_rh()
