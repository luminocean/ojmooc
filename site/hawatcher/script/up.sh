#!/bin/bash
#启动一个hawatcher进程(守护进程的保护下)

#获取项目的根目录
function get_root_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)
    local root_path=${dir%/*}
    echo "$root_path"
}

#创建需要的目录和文件（如果没有）
function prepare(){
    mkdir -p "/tmp/hawatcher"
    echo "" > "/tmp/hawatcher/ojrunner_output.txt"
    echo "" > "/tmp/hawatcher/ojdebugger_output.txt"
}

root_path=$(get_root_path)
log_path="/tmp/hawatcher"
script_deamon_path="${root_path}/script/script_deamon.sh"


case "$1" in
    ojrunner)
        command="${root_path}/app.js"
        log_file_path="${log_path}/ojrunner_output.txt"
        prepare

        #开启runner负载均衡，默认配置，监听8080
        nohup "${script_deamon_path}" "${command}" "${log_file_path}" &> /dev/null &
        ;;
    ojdebugger)
        command="${root_path}/app.js -d -p 8081"
        log_file_path="${log_path}/ojdebugger_output.txt"
        prepare

        #开启debugger负载均衡,debugger模式，监听8081
        nohup "${script_deamon_path}" "${command}" "${log_file_path}" &> /dev/null &
        ;;
    *)
        echo "Usage: up.sh {ojrunner|ojdebugger}"
        ;;
esac
