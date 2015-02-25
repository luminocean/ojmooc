#!/bin/bash
#vagrant's init script
#install git
sudo apt-get install -y git
#download ojmooc project and install related software and environments
mkdir -p /home/vagrant
cd /home/vagrant \
    && sudo git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && cd ./ojmooc/site/ojrunner/script/setup \
    && sudo ./setup.sh \
    && cd /home/vagrant
