#!/bin/bash
config_path="$1"

#通知之前的haproxy关闭，然后开启新的haproxy进程
touch "${config_path}/haproxy.pid"
haproxy -f "${config_path}/haproxy.cfg" -p "${config_path}/haproxy.pid" \
    -sf $(cat "${config_path}/haproxy.pid")