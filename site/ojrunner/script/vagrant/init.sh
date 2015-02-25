#!/bin/bash
#vagrant's init script
#install git
sudo apt-get install -y git
#download ojmooc project and install related software and environments
mkdir -p /home/vagrant
cd /home/vagrant \
    && sudo git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && cd ./ojmooc/site \
    && npm install ./hawatcher \
    && npm install ./ojrunner \
    && npm install ./ojdebugger \
    && npm install ./ojclient \
    && npm install ./ojdebugger-gui \
    && cd ./ojrunner/script \
    && sudo ./setup.sh \
    && cd /home/vagrant
