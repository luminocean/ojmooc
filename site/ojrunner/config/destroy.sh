#!/bin/bash
#本脚本用于关闭并删除已经启动的执行系统
container=$(docker ps -a | grep ojrunner)
#如果存在容器则删除
if [ -n "$container" ];then
    docker rm -f ojrunner
fi
