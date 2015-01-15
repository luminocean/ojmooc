#!/bin/bash
#用于关闭HAWatcher的脚本

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

pid=$(cat "$root_path"/log/hawatch.pid)
if [ -n "$pid" ]; then
    kill "$pid"
fi