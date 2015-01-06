#!/bin/bash
#$1应为可执行程序的文件名
exe_name="$1"

#创建报告文件
touch ~/ojmooc/site/ojrunner/report_repo/${exe_name}.txt

input_data=`cat "-"`

#进入docker环境执行程序
echo "$input_data" \
| docker run -i --rm=true \
    -v ~/ojmooc/site/ojrunner/build_repo:/home/build_repo \
    -v ~/ojmooc/site/ojrunner/report_repo:/home/report_repo \
    -v ~/ojmooc/site/ojrunner/shell:/home/shell \
    ojrunner-img2 sudo bash /home/shell/docker.sh "$exe_name"



