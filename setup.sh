#! /bin/sh

# ssh-keygen -R 192.168.43.199

# sudo apt-get install xrdp
# sudo service xrdp start

# 1 copy and paste this line in a terminal first 
sudo apt-get update && sudo apt-get install git;
# 2 copy and paste this line second
mkdir projects && cd /home/pi/projects && git clone https://github.com/elennon/mqtt_sensors.git

# 3 then cd /home/pi/projects/mqtt_sensors and then run ./setup.sh

#// node, nvm, npm
sudo apt-get update && sudo apt-get install git && echo 'done update' && wget https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-armv6l.tar.gz && tar -xvf node-v4.0.0-linux-armv6l.tar.gz && cd node-v4.0.0-linux-armv6l && sudo cp -R * /usr/local/ && cd && echo 'done node';
    
       
#nvm:
sudo apt-get install build-essential libssl-dev && curl https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash && source ~/.profile;
    
#npm
sudo npm install npm@latest -g && nvm install v7.2.1 && nvm use v7.2.1 && echo 'done npm/nvm';
    
# python
sudo apt-get install -y python-smbus i2c-tools libi2c-dev python-rpi.gpio python3-rpi.gpio python-dev libglib2.0-dev python-pip build-essential && echo 'all done first python' && sudo pip install w1thermsensor && sudo pip install paho-mqtt && sudo pip install sht-sensor;

git clone https://github.com/adafruit/Adafruit_Python_BMP.git &&
cd Adafruit_Python_BMP &&
sudo python setup.py install;

sudo apt-get install apache2 && sudo apt-get install php5;


sudo apt-get install gedit;

#sudo gedit  /boot/config.txt
#dtparam=i2c_arm=on
#dtparam=i2c1=on
#dtoverlay=w1-gpio,gpiopin=18


#sudo gedit /etc/modules
#i2c-bcm2708
#i2c-dev
#w1-gpio
#w1-therm



