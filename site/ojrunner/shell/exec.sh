#!/bin/bash
#$1应为可执行程序的全路径
exe_full_path="$1"

#从标准输入流里面加载程序的输入数据
cat "-" | "$exe_full_path"


