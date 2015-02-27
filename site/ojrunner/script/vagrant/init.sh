#!/bin/bash
#vagrant's init script

#替换源
if [ ! -f "/etc/apt/sources.list.backup" ];then
    #如果没有备份过先备份一下
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
fi
sudo cp ./sources.list /etc/apt

sudo apt-get update
#要把项目拖下来，所以先安装git
sudo apt-get install -y git

#vagrant根目录
old_dir=$(pwd)

mkdir -p /home/vagrant
cd /home/vagrant \
    && git clone -b paper http://git.iyopu.com:10080/datouxia/ojmooc.git \
    && sudo chown -R vagrant ojmooc \
    && sudo chgrp -R vagrant ojmooc \
    && cd ./ojmooc/site/ojrunner/script/setup \
    && cp "$old_dir"/sources.list . \
    && sudo ./setup.sh \
    && cd /home/vagrant

#把vagrant用户加入docker组，使得docker的相关操作不用写sudo了
sudo gpasswd -a vagrant docker \
    && sudo su vagrant
