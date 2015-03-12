#!/bin/bash
#关闭所有开启的hawatcher和haproxy进程

#运行期文件目录
runtime_dir="/tmp/hawatcher/runtime"

#关闭守护模式
echo "关闭守护模式..."
deamon_ids=$(ps -e | grep script_deamon | awk '{print $1}')
if [ -n "$deamon_ids" ];then
    sudo kill $(ps -e | grep script_deamon | awk '{print $1}')
fi

#关闭hawatcher进程
for file in $(ls "$runtime_dir");do
    pid_file_name=$(echo "$file" | grep watcher)
    pid_file_path="$runtime_dir/$pid_file_name"
    if [ -n "$pid_file_name" -a -f "$pid_file_path" ];then
        watcher_pid=$(cat "$runtime_dir/$pid_file_name")
        #向watcher进程发送信号
        sudo kill "$watcher_pid"
    fi
done
