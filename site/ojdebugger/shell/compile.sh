#!/bin/bash

#$1 编译器名称
compiler=$1
#$2 需要编译的源文件路径
srcPath=$2
#$3 编译后的文件路径
buildPath=$3

#检查源文件存在与否
if [ -z "$compiler" ];then
	echo "编译器未指定"
	exit 1
elif [ ! -f "$srcPath" ]; then
	echo "源文件不存在"
	exit 1
#检查是否给出了目标路径
elif [ -z "$buildPath" ]; then
	echo "目标编译路径为空"
	exit 1
fi

#根据使用的编译器执行编译
case "$compiler" in
	#pascal
	"fpc")
		"$compiler" "$srcPath" -o"$buildPath";;
	#qbasic
	"fbc")
		"$compiler" -lang qb "$srcPath" -x "$buildPath";;
	#其他，如clang,clang++
	*)
		"$compiler" -g "$srcPath" -o "$buildPath";;
esac

if [ "$?" -ne 0 ];then
	exit 1
fi

#清理中间文件（.o文件）
if [ -f "${buildPath}.o" ];then
	rm "${buildPath}.o"
fi