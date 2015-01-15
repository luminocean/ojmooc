#!/bin/bash
#启动HAWatcher的脚本

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

#后台运行HAWatcher
nodejs "$root_path"/app.js >> "$root_path"/log/log 2>&1 &
#将后台node进程的pid记录下来，关闭的时候要用到
echo $! > "$root_path"/log/hawatch.pid