#!/bin/bash
#本脚本用于监视启动的node脚本的运行情况，如果崩溃则自动重启

command=$1
log_file_path=$2

runtime_path="/tmp/hawatcher/runtime"

#清理hawatcher异常退出而得不到清理的haproxy
function cleanup(){
    #遍历runtime下的所有文件
    for file in $(ls "$runtime_path");do
        #找出watcher的pid文件
        watcher_pid_file_name=$(echo "$file" | grep 'watcher')
        watcher_pid_file_path="$runtime_path/$watcher_pid_file_name"

        if [ -z "$watcher_pid_file_name" -o ! -f "$watcher_pid_file_path" ];then
            continue
        fi

        #从pid文件中获取watcher的pid
        watcher_pid=$(cat "$runtime_path/$watcher_pid_file_name")

        #如果hawatcher还没有挂掉则跳过
        watcher_process_exists=$(ps -e | grep "$watcher_pid" | awk '{print $1}')

        if [ -n "$watcher_process_exists" ];then
            continue
        fi

        #把watcher的pid文件名中去掉.watcher就得到了haproxy的pid文件名
        proxy_pid_file_name=$(echo -n "${watcher_pid_file_name/\.watcher/''}")
        proxy_pid_file_path="$runtime_path/$proxy_pid_file_name"

        #把这个挂掉的hawatcher带起来的haproxy也给关掉
        if [ -n "$proxy_pid_file_name" -a -f "$proxy_pid_file_path" ];then
            proxy_pid=$(cat "$proxy_pid_file_path")
            echo $proxy_pid
            if [ -n $(ps -e | grep "$proxy_pid" | awk '{print $1}') ];then
                kill "$proxy_pid"
                sleep 1
            fi
        fi
    done
}

echo "守护模式开启..."
while true;
do
    {
        #每次重启时先做清理
        cleanup

        ${command}
        echo "Stopped unexpected, restarting..."
    } &>> "${log_file_path}"
    sleep 5
done
