#!/bin/bash
#关闭所有开启的hawatcher和haproxy进程

#运行期文件目录
runtime_dir="/tmp/hawatcher/runtime"

for file in $(ls "$runtime_dir");do
    watcher_pid_file_name=$(echo "$file" | grep watcher)
    if [ -n "$watcher_pid_file_name" ];then
        watcher_pid=$(cat "$runtime_dir/$watcher_pid_file_name")
        #向watcher进程发送信号
        sudo kill "$watcher_pid"
    fi
done
