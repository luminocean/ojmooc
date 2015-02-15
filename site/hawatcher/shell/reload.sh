#!/bin/bash
config_file_path=$1
pid_file_path=$2

#通知之前的haproxy关闭，然后开启新的haproxy进程
#touch "${config_path}/haproxy.pid"
#haproxy -f "${config_path}/haproxy.cfg" -p "${config_path}/haproxy.pid" \
#    -sf $(cat "${config_path}/haproxy.pid")

#直接杀掉进程重新加载配置文件
#pids=$(ps -e | grep ' haproxy$' | awk '{print $1}')
if [ -f "${pid_file_path}" ];then
    pids=`cat "${pid_file_path}"`
    if [ -n "$pids" ]; then
        kill "$pids"
    fi
fi
#启动haproxy，同时输出自己的pid
haproxy -f "${config_file_path}" -p "${pid_file_path}" &