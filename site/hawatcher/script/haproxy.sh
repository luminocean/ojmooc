#!/bin/bash
#仅仅用于启动HAProxy的脚本，测使用

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

#启动HAProxy
if [ -z "$(ps -e | grep ' haproxy$')" ]; then
    haproxy -f "${root_path}/config/haproxy.cfg"
fi