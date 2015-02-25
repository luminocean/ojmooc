#!/bin/bash
###
# 本脚本用于配置宿主环境的各种依赖项目
# 包括安装各种依赖程序，开启HAProxy和Docker的某些配置以支持负载均衡
# ##

#替换源
if [ ! -f "/etc/apt/sources.list.backup" ];then
    #如果没有备份过先备份一下
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
fi
sudo cp ./sources.list /etc/apt

#更新
sudo apt-get update

### 安装依赖程序
sudo apt-get install -y dos2unix nodejs npm haproxy docker.io wget llvm clang gdb fpc vim time valgrind
#其中valgrind可能会有版本上的问题需要下载源码编译安装(lubuntu上)
###

### 开启haproxy的脚本控制
sudo sed -i 's/ENABLED=0/ENABLED=1/g' /etc/default/haproxy
###

### 开启docker.io的tcp通讯接口
#docker配置文件的位置
docker_config_path="/etc/default/docker.io"
if [ ! -f "$docker_config_path" ]; then
    docker_config_path="/etc/default/docker"
fi
#检查配置文件是否存在
if [ ! -f "$docker_config_path" ]; then
    echo "/etc/default/处找不到docker或docker.io配置文件"
    exit 1
fi

current_setting=$(cat "$docker_config_path" | sed -n '/^DOCKER_OPTS/p')
#如果已经配置过了就作替换
if [ -n "$current_setting" ]; then
    sudo sed -i 's/^DOCKER_OPTS.*$/DOCKER_OPTS="-H tcp:\/\/0.0.0.0:4243 -H unix:\/\/\/var\/run\/docker.sock"/g' "$docker_config_path"
else

#如果没有配过就加一句
    sudo sed -i '$a DOCKER_OPTS="-H tcp:\/\/0.0.0.0:4243 -H unix:\/\/\/var\/run\/docker.sock"' "$docker_config_path"
fi

#重启docker
sudo service docker restart

#安装npm的依赖包
#备份当前的目录
current_dir=$(pwd)
cd ../../../
#回到site目录
site_dir=$(pwd)
cd $site_dir/hawatcher && npm install
cd $site_dir/ojclient && npm install
cd $site_dir/ojrunner && npm install
cd $site_dir/ojdebugger && npm install
cd $site_dir/ojdebugger-gui && npm install
cd $current_dir

#开始下载并安装docker镜像
#生成的docker镜像名
img_name="oj-img"
#rl=$(readlink -f $0)
#dir=$(dirname $rl)
#root_path=${dir%/*}

#生成镜像,使用当前目录的Dockerfile文件
sudo docker build -t "$img_name" .

if [ $? -eq 0 ]; then
    echo "环境安装完成"
fi
