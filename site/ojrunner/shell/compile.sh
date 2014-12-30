#!/bin/bash

#$1和$2分别代表需要编译的源文件路径和编译后的文件路径

#如果源文件不存在就退出
if [ ! -f "$1" ]; then
	echo "源文件不存在"
	exit 1
elif [ -z "$2" ]; then
	echo "目标编译路径为空"
	exit 1
fi

#执行编译
clang++ "$1" -o "$2"