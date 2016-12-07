#! /bin/sh

# ssh-keygen -R 192.168.43.199
# git clone https://github.com/elennon/mqtt_sensors.git
# sudo apt-get install xrdp
# sudo service xrdp start

#sudo apt-get update && sudo apt-get install git;

#// node, nvm, npm
sudo apt-get update && sudo apt-get install git && echo 'done update' && wget https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-armv6l.tar.gz && tar -xvf node-v4.0.0-linux-armv6l.tar.gz && cd node-v4.0.0-linux-armv6l && sudo cp -R * /usr/local/ && echo 'done node';
    
       
#nvm:
sudo apt-get install build-essential libssl-dev && curl https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash && source ~/.profile;
    
#npm
npm install npm@latest -g && nvm install v7.2.1 && echo 'done npm/nvm';
    

// python
sudo apt-get install -y python-smbus i2c-tools libi2c-dev python-rpi.gpio python3-rpi.gpio python-dev libglib2.0-dev python-pip build-essential && echo 'all done'


