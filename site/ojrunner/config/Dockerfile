# DOCKER-VERSION 0.10.0

#基于ubuntu14.04
FROM ubuntu:14.04

RUN apt-get update

#安装依赖的工具，尤其是valgrind
RUN apt-get install -y wget llvm clang fpc vim time valgrind nodejs npm

#安装一些不知道为什么缺少的工具
RUN apt-get install -y --reinstall binutils

#安装FreeBasic
RUN wget http://downloads.sourceforge.net/fbc/FreeBASIC-1.01.0-linux-x86_64.tar.gz \
        && tar -zxvf FreeBASIC-1.01.0-linux-x86_64.tar.gz \
        && cd FreeBASIC-1.01.0-linux-x86_64/ \
        && sudo apt-get install -y gcc libncurses5-dev libffi-dev libgl1-mesa-dev \
              libx11-dev libxext-dev libxrender-dev libxrandr-dev libxpm-dev \
        && sudo ./install.sh -i \
        && cd .. \
        && sudo rm -r FreeBASIC-1.01.0-linux-x86_64 \
        && sudo rm FreeBASIC-1.01.0-linux-x86_64.tar.gz
