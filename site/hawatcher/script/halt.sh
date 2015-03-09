#!/bin/bash
#关闭所有开启的hawatcher和haproxy进程

#获取当前项目的根目录
rl=$(readlink -f $0)
dir=$(dirname $rl)
root_path=${dir%/*}

#运行期文件目录
runtime_dir="$root_path"/runtime

for file in $(ls "$runtime_dir");do
    watcher_pid_file_name=$(echo "$file" | grep watcher)
    if [ -n "$watcher_pid_file_name" ];then
        watcher_pid=$(cat "$runtime_dir/$watcher_pid_file_name")
        #向watcher进程发送信号
        sudo kill "$watcher_pid"
    fi
done
