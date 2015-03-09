#!/bin/bash
#本脚本用于同时开启runner和debugger的docker环境以及负载均衡

#获取ojmooc项目的绝对路径
#做法是先取出当前目录的绝对路径，类似于/**/ojmooc/site/**,然后删除从/site到结尾的内容即可
function get_ojmooc_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)

    local ojmooc_path=${dir%%/site*}
    echo "$ojmooc_path"
}

#site目录
site_path=$(get_ojmooc_path)"/site"

if [ ! -d "$site_path" ];then
    echo "ojmooc下的site目录找不到，获取的site目录为${site_path}"
    exit 0
fi

echo "开启runner和debugger的docker环境..."
runner_up_script_path="${site_path}/ojrunner/script/up.sh"
debugger_up_script_path="${site_path}/ojdebugger/script/up.sh"

#一起开启多少个runner以及debugger
up_num=1

counter=0
while [ "$counter" -lt "$up_num" ]
do
    "$runner_up_script_path"
    "$debugger_up_script_path"
    ((counter+=1))
done

echo "开启HAProxy和HAWatcher的负载均衡..."
watcher_app_path="${site_path}/hawatcher/app.js"

#runner负载均衡，默认配置，监听8080
"${watcher_app_path}" &

#debugger负载均衡,debugger模式，监听8081
"${watcher_app_path}" -d -p 8081 &



