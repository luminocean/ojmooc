#!/bin/bash
# 启动主机环境（基于已经配置好的环境）

#判断一个进程是否在运行
#需要传入该进程的名称,返回-1表示没有在运行，否则返回进程的id列表
function running(){
    ids=$(ps -e | grep "$1" | awk '{print $1}')
    if [ -z "$ids" ]; then
         echo -1
    fi
    echo "$ids"
}

#获取本项目根目录的绝对路径
function get_root_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)
    local root_path=${dir%/*}
    echo "$root_path"
}

#启动docker
ids=$(running docker)
if [ "$ids" -eq -1 ]; then
    sudo service docker.io start
fi

#启动HAWatcher，由HAWatcher开启HAProxy提供负载均衡服务
#这里默认HAWatcher和ojrunner在同一目录下
root_path=$(get_root_path)
watcher_path=${root_path%/*}/hawatcher
"$watcher_path"/script/launch.sh