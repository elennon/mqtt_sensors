from w1thermsensor import W1ThermSensor
import json

for sensor in W1ThermSensor.get_available_sensors([W1ThermSensor.THERM_SENSOR_DS18B20]):
    print json.dumps( { "sensorId" : sensor.id, "val" : sensor.get_temperature() })
