#!/bin/bash
#本脚本用于启动docker下的node执行服务器

#将服务器运行为守护进程，对外暴露端口1337
docker run -d -i -p 1337:1337 \
    -v /home/luminocean/ojmooc/site/ojrunner/docker:/home/nodejs \
    ojrunner-node-img nodejs /home/nodejs/server.js
