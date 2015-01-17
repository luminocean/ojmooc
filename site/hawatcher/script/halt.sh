#!/bin/bash
#关闭HAWatcher的脚本

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

#关掉HAProxy进程
pids=$(ps -e | grep ' haproxy$' | awk '{print $1}')
if [ -n "$pids" ]; then
    kill "$pids"
fi

#关掉HAWatcher进程
pid=$(cat "$root_path"/log/hawatch.pid)
if [ -n "$pid" ]; then
    kill "$pid"
    echo -n "" > "$root_path"/log/hawatch.pid
fi