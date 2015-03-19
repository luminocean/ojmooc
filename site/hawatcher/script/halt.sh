#!/bin/bash
#关闭所有开启的hawatcher和haproxy进程

#运行期文件目录
runtime_path="/tmp/hawatcher/runtime"

#关闭守护模式
echo "关闭守护模式..."
deamon_ids=$(ps -e | grep script_deamon | awk '{print $1}')
if [ -n "$deamon_ids" ];then
    sudo kill $(ps -e | grep script_deamon | awk '{print $1}')
fi

#依次关闭runtime下所有的进程
echo "关闭所有hawtcher以及haproxy进程..."
for file in $(ls "$runtime_path");do
    pid_file_name=$(echo "$file" | grep 'pid')
    pid_file_path="$runtime_path/$pid_file_name"
    if [ -n "$pid_file_name" -a -f "$pid_file_path" ];then
        pid=$(cat "$runtime_path/$pid_file_name")
        if [ -n $(ps -e | grep "$pid" | awk '{print $1}') ];then
            sudo kill "$pid"
            sleep 1
        fi
    fi
done

#清空runtime下的所有文件
echo "清理hawatcher相关运行期文件"
for file in $(ls "$runtime_path");do
    file_path="$runtime_path/$file"
    rm "$file_path"
done
