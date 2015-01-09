#!/bin/bash
#本脚本主要用于将tmp目录挂载到内存上面去，从而提升临时文件读写性能

cwd=$(pwd)
#本程序的根目录地址，即***/ojrunner，用于检查是否已经挂载
#这里默认mount.sh在ojrunner的config子目录下
#位置变更的情况下请手动调整
dir=${cwd%/*}

if [ ! -d "$dir" ];then
    echo "mount.sh中当前程序的目录地址配置有误，无法检查是否mount了内存文件系统到tmp上。 \
            请检查目录配置是否有误"
fi

#先检查是否已经挂载
mount_record=$(df -a | grep "$dir")
#如果由挂载记录表示已经挂载好，就不再往下处理了
if [ -n "$mount_record" ];then
    echo "tmp目录已被内存挂载，挂载操作完成"
    exit 0
fi

#否则执行挂载动作
#将内存文件系统挂载到ojrunner/tmp目录
sudo mount -t ramfs none ../tmp
#更改权限使node进程可以访问和修改
sudo chmod a+w ../tmp

echo "挂载完成"
