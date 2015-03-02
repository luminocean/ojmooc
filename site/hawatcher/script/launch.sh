#!/bin/bash
#启动HAWatcher的脚本

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

touch "$root_path"/log/hawatch.pid
touch "$root_path"/log/log

#如果HAProxy没有启动就先启动
if [ -z "$(ps -e | grep ' haproxy$')" ]; then
    haproxy -f "${root_path}/config/haproxy.cfg"
fi

pid=$(cat "$root_path"/log/hawatch.pid)
current=$(ps -e | grep "$pid")
if [ -n "$pid" -a -n "$current" ]; then
    echo "HAWatcher已经启动，不再重复启动"
    exit 0
fi

#后台运行HAWatcher
nodejs "$root_path"/app.js >> "$root_path"/log/log 2>&1 &
#将后台node进程的pid记录下来，关闭的时候要用到
echo $! > "$root_path"/log/hawatch.pid
