#!/bin/bash
#$1为可执行程序的文件名
exe_name="$1"
#可执行文件目录路径
build_path="$2"
#报告文件目录路径
report_path="$3"
#shell目录路径
shell_path="$4"

#从输入流中读取输入数据
input_data=`cat "-"`

#第一次执行程序，获取程序的运行时间以及运行结果
#其中运行结果通过标准输出给出，运行时间通过报告文件给出
echo "$input_data" | (time "$build_path/$exe_name") 2> "$report_path/${exe_name}.txt"

if [ "$?" -ne 0 ];then
    echo "程序运行错误"
    exit 1
fi

#格式化报告文件，去除文件内的空行，将tab统一替换成空格
sed -i '/^\s*$/d' "$report_path/${exe_name}.txt"
sed -i 's/\t/ /g' "$report_path/${exe_name}.txt"

#第二次执行程序，获取程序的内存使用情况
#其中内存使用结果存放于临时文件中
echo "$input_data" | (valgrind --tool=massif \
    --massif-out-file="$report_path/${exe_name}_rawmemusg.txt" \
    --time-unit=B --stacks=yes \
    "$build_path/$exe_name") &> /dev/null

#无法生成valgrind报告，可能是valgrind对free pascal生成程序的bug
#使用GNU/time粗略统计使用内存，即统计RSS数据（max Resident Set Size）
if [ ! -f "$report_path/${exe_name}_rawmemusg.txt" ];then
    max_rss=$(echo "$input_data" | \
        (/usr/bin/time -v "$build_path/$exe_name">/dev/null) 2>&1 \
        | sed -n '10p' | awk '{print $6}')
    max_rss=$((max_rss*1000))
    echo "mem $max_rss" >> "$report_path/${exe_name}".txt
    exit 0
fi

#解析原始数据文件
ms_print "$report_path/${exe_name}_rawmemusg.txt" > "$report_path/${exe_name}_graph.txt"
#从解析结果中取出各个时间点中内存使用最大的值
max_mem_usage=$(cat "$report_path/${exe_name}_graph.txt" \
    | grep '^[0-9, ]*$' | sed 's/,//g' \
    | sed '/^\s*$/d' | awk '{print $3}' \
    | awk '{if($1>max)max=$1}END{print max}')

#输出到报告文件中
echo "mem $max_mem_usage" >> "$report_path/${exe_name}".txt
#清除临时文件
rm "$report_path/${exe_name}_rawmemusg.txt" "$report_path/${exe_name}_graph.txt"



