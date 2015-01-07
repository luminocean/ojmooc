#!/bin/bash
#本脚本为在docker内部执行的脚本

#$1应为可执行程序的文件名
exe_name="$1"

input_data=$(cat "-")

#第一次执行程序，获取程序的运行时间以及运行结果
#其中运行结果通过标准输出给出，运行时间通过报告文件给出
echo "$input_data" | (time /home/build_repo/"$exe_name") 2> /home/report_repo/"${exe_name}".txt

if [ "$?" -ne 0 ];then
    echo "程序运行错误"
    exit 1
fi

#格式化报告文件，去除文件内的空行，将tab统一替换成空格
sed -i '/^\s*$/d' /home/report_repo/"${exe_name}".txt
sed -i 's/\t/ /g' /home/report_repo/"${exe_name}".txt

#第二次执行程序，获取程序的内存使用情况
#其中内存使用结果存放于临时文件中
echo "$input_data" | (valgrind --tool=massif \
    --massif-out-file=/home/report_repo/${exe_name}_rawmemusg.txt \
    --time-unit=B --stacks=yes \
    /home/build_repo/"$exe_name") &> /dev/null

if [ ! -f "/home/report_repo/${exe_name}_rawmemusg.txt" ];then
    #无法生成valgrind报告，为valgrind对free pascal生成程序的bug
    exit 0
fi

ms_print /home/report_repo/${exe_name}_rawmemusg.txt > /home/report_repo/${exe_name}_graph.txt

max_mem_usage=$(cat /home/report_repo/${exe_name}_graph.txt \
    | grep '^[0-9, ]*$' | sed 's/,//g' \
    | sed '/^\s*$/d' | awk '{print $3}' \
    | awk '{if($1>max)max=$1}END{print max}')

echo "mem $max_mem_usage" >> /home/report_repo/"${exe_name}".txt

rm "/home/report_repo/${exe_name}_rawmemusg.txt" "/home/report_repo/${exe_name}_graph.txt"
