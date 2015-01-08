# DOCKER-VERSION 0.10.0

#基于ubuntu14.04
FROM ubuntu:14.04

RUN apt-get update

#安装依赖的工具，尤其是valgrind
RUN apt-get install -y vim time valgrind

#安装一些不知道为什么缺少的工具
RUN apt-get install -y --reinstall binutils
