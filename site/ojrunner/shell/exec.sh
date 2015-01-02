#!/bin/bash
#$1应为可执行程序的文件名
exe_name="$1"

#创建报告文件
touch ~/ojmooc/site/ojrunner/report_repo/${exe_name}.txt

#从标准输入流里面加载程序的输入数据
cat "-" | docker run -i --rm=true \
    -v ~/ojmooc/site/ojrunner/build_repo:/home/build_repo \
    -v ~/ojmooc/site/ojrunner/report_repo:/home/report_repo \
    ojrunner-img /bin/bash -c "(time /home/build_repo/$exe_name) 2> /home/report_repo/${exe_name}.txt"

#去除文件内的空行
sed -i '/^\s*$/d' ~/ojmooc/site/ojrunner/report_repo/${exe_name}.txt
#将tab统一替换成空格
sed -i 's/\t/ /g' ~/ojmooc/site/ojrunner/report_repo/${exe_name}.txt