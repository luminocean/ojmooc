# 部署指南
本文档用于说明各个服务器环境或项目该如何搭建

### Online Judge后台
##### 1.（重要的放前面）如何启动环境
执行`ojmooc/site/ojrunner/script/setup/run_all.sh`即可
相关脚本说明如下：
> * run_all.sh 先调用destroy_all.sh，然后启动所有实例
> * destroy_all.sh 销毁当前的所有启动的实例
> * diagnose.sh 诊断当前所有启动实例的运行情况，执行测试用例。可以直接执行diagnose.sh来获得使用帮助

*注：上述的“实例”包括装载有ojrunner和ojdebugger的docker容器、haproxy负载均衡器、hawatcher监视器、以及保护hawatcher的shell脚本*

环境启动后，本机的8080和8081端口将会分别提供编译执行服务（ojrunner提供）以及debug服务（ojdebugger提供）。然后可以通过操作ojclient来发出请求了，具体参见ojclient的文档

##### 2.如何安装环境
在全新的ubuntu14.04系统下，依次执行以下操作：
> * （建议）切换到非root用户下。如果没有非root用户（比如在阿里云中新建的服务器），则新建用户 `useradd vagrant -m -s /bin/bash`，用`passwd vagrant`设置初始密码，将vagrant加入/etc/sudoers从而使其可以使用sudo
> * 执行`sudo apt-get install git`安装git
> * 从git仓库中clone下ojmooc项目到当前用户的home目录下(~)
> * sudo执行`ojmooc/site/ojrunner/script/setup/setup.sh`
> * 执行`sudo gpasswd -a $USER docker && sudo su $USER`，从而让该普通用户具有直接操作docker的权限