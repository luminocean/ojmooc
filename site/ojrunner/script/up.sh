#!/bin/bash
#本脚本用于启动docker下的node执行服务器

#获取宿主机ojrunner项目的路径
rl=$(readlink -f $0)
config_dir=$(dirname $rl)
host_ojrunner_path=${config_dir%/*}
#docker内的ojrunner路径
docker_ojrunner_path="/home/ojrunner"

#docker内服务器监听的端口
docker_port=23333
#映射到主机上的端口
#host_port=23333
#docker内ojrunner的入口文件
docker_main="app.js"

#如果已经存在ojrunner容器，则先删除
#container=$(docker ps -a | grep ojrunner)
#如果存在容器则删除
#if [ -n "$container" ];then
#    docker stop ojrunner
#    docker rm ojrunner
#fi

#将服务器运行为守护进程，加入docker容器列表
docker run -d -P -p "$docker_port" \
    -v "$host_ojrunner_path":"$docker_ojrunner_path" \
    ojrunner-img nodejs "${docker_ojrunner_path}/${docker_main}"
