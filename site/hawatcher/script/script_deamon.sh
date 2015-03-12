#!/bin/bash
#本脚本用于监视启动的node脚本的运行情况，如果崩溃则自动重启

command=$1
log_file_path=$2

runtime_path="/tmp/hawatcher/runtime"

#清理hawatcher异常退出而得不到清理的haproxy
function cleanup(){
    for file in $(ls "$runtime_path");do
        watcher_pid_file_name=$(echo "$file" | grep 'watcher')
        watcher_pid_file_path="$runtime_path/$watcher_pid_file_name"
        if [ -n "$watcher_pid_file_name" -a -f "$watcher_pid_file_path" ];then
            watcher_pid=$(cat "$runtime_path/$watcher_pid_file_name")
            #如果hawatcher进程已经挂掉
            if [ -z $(ps -e | grep "$watcher_pid" | awk '{print $1}') ];then
                #把watcher的pid文件名中去掉.watcher就得到了haproxy的pid文件名
                proxy_pid_file_name=${watcher_pid_file_name/\.watcher/''}
                proxy_pid_file_path="$runtime_path/$proxy_pid_file_name"
                #把这个挂掉的hawatcher带起来的haproxy也给关掉
                if [ -n "$proxy_pid_file_name" -a -f "$proxy_pid_file_path" ];then
                    pid=$(cat "$proxy_pid_file_path")
                    if [ -n $(ps -e | grep "$pid" | awk '{print $1}') ];then
                        sudo kill "$pid"
                        sleep 1
                    fi
                fi
            fi
        fi
    done
}

echo "守护模式开启..."
while true;
do
    {
        cleanup

        ${command}
        echo "Stopped unexpected, restarting \r\n\r\n"
    } &>> "${log_file_path}"
    sleep 1
done
