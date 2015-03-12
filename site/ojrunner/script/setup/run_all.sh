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

#获取当前路径
function get_current_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)
    echo "$dir"
}

#site目录
site_path=$(get_ojmooc_path)"/site"
if [ ! -d "$site_path" ];then
    echo "ojmooc下的site目录找不到，获取的site目录为${site_path}"
    exit 0
fi

echo "关闭已开启的docker环境以及负载均衡"
current_path=$(get_current_path)
"${current_path}/destroy_all.sh"

echo "开启runner和debugger的docker环境..."
runner_up_script_path="${site_path}/ojrunner/script/up.sh"
debugger_up_script_path="${site_path}/ojdebugger/script/up.sh"

#一起开启多少个runner以及debugger
up_num=3
counter=0
while [ "$counter" -lt "$up_num" ]
do
    "$runner_up_script_path"
    "$debugger_up_script_path"
    ((counter+=1))
done

#开启HAProxy和HAWatcher的负载均衡
echo "开启HAProxy和HAWatcher的负载均衡..."
watcher_up_script_path="${site_path}/hawatcher/script/up.sh"

${watcher_up_script_path} ojrunner
${watcher_up_script_path} ojdebugger


#停顿一下，然后做进程信息统计和记录
sleep 3

#输出watcher刚才的标准输出
cat "/tmp/hawatcher/ojrunner_output.txt"
cat "/tmp/hawatcher/ojdebugger_output.txt"

#统计开启的进程的数量数据
app_js_process_count=$(ps -e| grep "app.js" | wc -l)
haproxy_process_count=$(ps -e| grep "haproxy" | wc -l)
echo "当前app.js进程${app_js_process_count}个，haproxy进程${haproxy_process_count}个"

#记录时间
echo "记录重启时间到/tmp/oj_restart_timestamp.txt..."
echo $(date +%c) >> /tmp/oj_restart_timestamp.txt



