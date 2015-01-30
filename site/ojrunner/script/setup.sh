#!/bin/bash
###
# 本脚本用于配置宿主环境的各种依赖项目
# 包括安装各种依赖程序，开启HAProxy和Docker的某些配置以支持负载均衡
# ##
sudo apt-get update

### 安装依赖程序
sudo apt-get install -y nodejs npm gdb haproxy docker.io
###

### 开启haproxy的脚本控制
sudo sed -i 's/ENABLED=0/ENABLED=1/g' /etc/default/haproxy
###

### 开启docker.io的tcp通讯接口
#docker配置文件的位置
docker_config_path="/etc/default/docker"
if [ ! -f "$docker_config_path" ]; then
    echo "/etc/default/docker处找不到docker配置文件"
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

#开始下载并安装docker镜像
#生成的docker镜像名
img_name="ojrunner-img"
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}
#生成镜像
sudo docker build -t "$img_name" "${root_path}/config"

if [ $? -eq 0 ]; then
    echo "环境安装完成"
fi
