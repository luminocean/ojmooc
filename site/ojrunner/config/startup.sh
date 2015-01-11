#!/bin/bash
#本脚本用于启动docker下的node执行服务器

#将服务器运行为守护进程，对外暴露端口23333
#其中将ojrunner的repo/build目录挂载到ojexecutor的repo/build目录下
#使得ojexecutor可以直接读取可执行文件
docker run -d -i -p 23333:23333 --name ojrunner \
    -v /home/luminocean/ojmooc/site/ojrunner:/home/ojrunner \
    ojrunner-img nodejs /home/ojrunner/app.js
