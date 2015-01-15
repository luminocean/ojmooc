#!/bin/bash
config_file_path="$1"

#通知之前的haproxy关闭，然后开启新的haproxy进程
#touch "${config_path}/haproxy.pid"
#haproxy -f "${config_path}/haproxy.cfg" -p "${config_path}/haproxy.pid" \
#    -sf $(cat "${config_path}/haproxy.pid")

#直接杀掉进程重新加载配置文件
pids=$(ps -e | grep 'haproxy' | awk '{print $1}')
if [ -n "$pids" ]; then
    kill "$pids"
fi
haproxy -f "${config_file_path}"
