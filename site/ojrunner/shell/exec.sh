#!/bin/bash
#$1为可执行程序的文件名
exe_name="$1"
#可执行文件目录路径
build_path="$2"
#报告文件目录路径
report_path="$3"
#shell目录路径
shell_path="$4"

#创建报告文件
touch "$report_path"/${exe_name}.txt

input_data=`cat "-"`

#进入docker环境执行程序
echo "$input_data" \
| docker run -i --rm=true \
    -v "$build_path":/home/build_repo \
    -v "$report_path":/home/report_repo \
    -v "$shell_path":/home/shell \
    ojrunner-img sudo bash /home/shell/docker.sh "$exe_name"



