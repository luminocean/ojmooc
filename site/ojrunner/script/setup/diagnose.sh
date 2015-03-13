#!/bin/bash
#本脚本用于诊断本机上的所有环境是否运行正常

function get_ojmooc_path(){
    local rl=$(readlink -f $0)
    local dir=$(dirname $rl)

    local ojmooc_path=${dir%%/site*}
    echo "$ojmooc_path"
}

function processStatus(){
    #统计开启的进程的数量数据
    app_js_process_count=$(ps -e| grep "app.js" | wc -l)
    haproxy_process_count=$(ps -e| grep "haproxy" | wc -l)
    echo -n "--->>"
    echo "当前app.js进程${app_js_process_count}个，haproxy进程${haproxy_process_count}个"
}

function dockerStatus(){
    echo -n "--->>"
    docker ps -a
}

function test(){
    ojmooc_path=$(get_ojmooc_path)
    client_path="${ojmooc_path}/site/ojclient"

    #测试ojrunner
    echo "--->>测试ojrunner"
    "${client_path}/runner_test.js"

    #测试ojdebugger
    echo "--->>测试ojdebubgger"
    "${client_path}/debugger_test.js"
}

case "$1" in
    -p)
        processStatus
        ;;
    -d)
        dockerStatus
        ;;
    -t)
        test
        ;;
    -a)
        processStatus
        dockerStatus
        test
        ;;
    *)
        echo "Usage: diagnose.sh {-p|-d|-t|-a}"
        echo ""
        echo "p=process status"
        echo "d=docker status"
        echo "t=test docker containers"
        echo "a=all above"
        ;;
esac

