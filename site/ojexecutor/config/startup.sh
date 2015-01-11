#!/bin/bash
#本脚本用于启动docker下的node执行服务器

#将服务器运行为守护进程，对外暴露端口23333
#其中将ojrunner的repo/build目录挂载到ojexecutor的repo/build目录下
#使得ojexecutor可以直接读取可执行文件
docker run -d -p 23333:23333 --name ojexecutor \
    -v /home/luminocean/ojmooc/site/ojexecutor:/home/ojexecutor \
    -v /home/luminocean/ojmooc/site/ojrunner/repo/build:/home/ojexecutor/repo/build \
    ojexecutor-img nodejs /home/ojexecutor/app.js
