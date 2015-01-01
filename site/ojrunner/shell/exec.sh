#!/bin/bash
#$1应为可执行程序的文件名
exe_name="$1"

#从标准输入流里面加载程序的输入数据
cat "-" | docker run -i --rm=true -v /home/luminocean/ojmooc/site/ojrunner/build_repo:/home/build_repo ojrunner-img /home/build_repo/$exe_name