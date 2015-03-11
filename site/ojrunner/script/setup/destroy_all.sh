#!/bin/bash
#本脚本用于关闭所有的负载均衡，删除所有的docker容器

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

echo "删除所有docker容器..."
docker_ids=$(docker ps -a | awk 'NF>10 {print $1}')
if [ -n "$docker_ids" ];then
    docker rm -f $(docker ps -a | awk 'NF>10 {print $1}')
fi

echo "关闭负载均衡..."
watcher_halt_script_path="${site_path}/hawatcher/script/halt.sh"
sudo "$watcher_halt_script_path"

sleep 3
app_js_process_count=$(ps -e| grep "app.js" | wc -l)
haproxy_process_count=$(ps -e| grep "haproxy" | wc -l)
echo "当前剩余app.js进程${app_js_process_count}个，haproxy进程${haproxy_process_count}个"

