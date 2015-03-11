#!/bin/bash
#本脚本用于关闭一个容器（通常是已经停止响应的）并再开启一个

#要关闭的容器id
container_id=$1
#即将开启的容器的类型
mode=$2

#获取ojmooc项目的绝对路径
#做法是先取出当前目录的绝对路径，类似于/**/ojmooc/site/**,然后删除从/site到结尾的内容即可
function get_ojmooc_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)

    local ojmooc_path=${dir%%/site*}
    echo "$ojmooc_path"
}

#关闭指定的docker容器
docker rm -f "$container_id"

#site目录
site_path=$(get_ojmooc_path)"/site"

if [ ! -d "$site_path" ];then
    echo "ojmooc下的site目录找不到，获取的site目录为${site_path}"
    exit 0
fi

#根据容器类型开启相应的docker容器
case "$mode" in
	"ojrunner")
	    up_script_path="${site_path}/ojrunner/script/up.sh";
		"$up_script_path";;
	"ojdebugger")
		up_script_path="${site_path}/ojdebugger/script/up.sh";
		"$up_script_path";;
	*)
	    echo "未知的container mode类型" > /dev/stderr
	    exit 1
esac


