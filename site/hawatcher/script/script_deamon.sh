#!/bin/bash
#本脚本用于监视启动的node脚本的运行情况，如果崩溃则自动重启

command=$1
log_file_path=$2

watcher_runtime_path="/tmp/hawatcher/runtime"


echo "守护模式开启..."
while true;
do
    {
        #这里要考虑hawatcher意外退出的情况，这时它带起来的haproxy还没有退出，这需要检查出来后进行清理
        ${command}
        echo "Stopped unexpected, restarting \r\n\r\n"
    } &>> "${log_file_path}"
    sleep 1
done
