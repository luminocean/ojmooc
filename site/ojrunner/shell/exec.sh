#!/bin/bash
#$1应为可执行程序的文件名
exe_name="$1"

#创建报告文件
touch ~/ojmooc/site/ojrunner/report_repo/$exe_name

#从标准输入流里面加载程序的输入数据
cat "-" | docker run -i --rm=true \
    -v ~/ojmooc/site/ojrunner/build_repo:/home/build_repo \
    -v ~/ojmooc/site/ojrunner/report_repo:/home/report_repo \
    ojrunner-img /usr/bin/time -o /home/report_repo/$exe_name -p /home/build_repo/$exe_name