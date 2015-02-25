#!/bin/bash
#vagrant's init script

#替换源
if [ ! -f "/etc/apt/sources.list.backup" ];then
    #如果没有备份过先备份一下
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
fi
sudo cp ./sources.list /etc/apt

#install git
sudo apt-get install -y git
#download ojmooc project and install related software and environments
mkdir -p /home/vagrant
cd /home/vagrant \
    && git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && cd ./ojmooc/site/ojrunner/script/setup \
    && sudo ./setup.sh \
    && cd /home/vagrant
