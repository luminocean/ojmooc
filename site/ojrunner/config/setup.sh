#!/bin/bash
#本shell用于配置主机（宿主）环境的依赖程序/库,使用时请以root权限执行（sudo）

#配置docker以及各种编译工具（其中free basic需要在下面单独安装,apt里面没有）
sudo apt-get update
sudo apt-get install -y fpc llvm clang docker.io

#使用Dockerfile生成docker镜像
sudo docker build -t ojrunner-img .

#开始安装FreeBasic
wget http://downloads.sourceforge.net/fbc/FreeBASIC-1.01.0-linux-x86_64.tar.gz \
    && tar -zxvf FreeBASIC-1.01.0-linux-x86_64.tar.gz \
    && cd FreeBASIC-1.01.0-linux-x86_64/ \
    && sudo apt-get install -y gcc libncurses5-dev libffi-dev libgl1-mesa-dev \
          libx11-dev libxext-dev libxrender-dev libxrandr-dev libxpm-dev \
    && sudo ./install.sh -i \
    && cd .. \
    && sudo rm -r FreeBASIC-1.01.0-linux-x86_64 \
    && sudo FreeBASIC-1.01.0-linux-x86_64.tar.gz

echo "自动安装完成"