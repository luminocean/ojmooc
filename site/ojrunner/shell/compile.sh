#!/bin/bash

#$1 编译器名称
#$2 需要编译的源文件路径
#$3 编译后的文件路径


#检查源文件存在与否
if [ -z "$1" ];then
	echo "编译器未指定"
	exit 1
elif [ ! -f "$2" ]; then
	echo "源文件不存在"
	exit 1
#检查是否给出了目标路径
elif [ -z "$3" ]; then
	echo "目标编译路径为空"
	exit 1
fi

#执行编译
"$1" "$2" -o"$3"

#清理中间文件（.o文件）
if [ -f "${3}.o" ];then
	rm "${3}.o"
fi