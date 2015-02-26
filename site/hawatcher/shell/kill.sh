#!/bin/bash
#本脚本仅用于当hawatcher退出时顺便关闭所监控的haproxy进程
pid_file_path=$1

kill $(cat "$pid_file_path")