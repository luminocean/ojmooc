# DOCKER-VERSION 0.10.0

FROM ubuntu

ADD shell /home/shell
ADD sources.list /etc/apt/

# make sure apt is up to date
RUN apt-get update

# install nodejs and npm
RUN apt-get install -y llvm clang vim

RUN apt-get install -y --reinstall binutils

CMD echo 'Build finished!'
