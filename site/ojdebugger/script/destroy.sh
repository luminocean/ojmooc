#!/bin/bash
#本脚本用于关闭并删除已经启动的执行系统
docker rm -f $(docker ps -a | awk 'NF>10 {print $1}')
