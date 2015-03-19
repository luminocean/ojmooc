# OJClient
用于访问OJRunner和OJDebugger的客户端程序。
该客户端可以简化编译执行任务和调试任务的 **请求构造** 和 **响应解析** ，提供了更易于使用的接口

# API 说明
## 访问OJRunner的API
访问OJRunner的主要API只有一个，使用方法如下所示：
```javascript
//app.js为ojclient的入口文件
//取出其中的runner成员，该成员即访问ojrunner的客户端对象
var runner = require('./app.js').runner;

runner.run(srcCode,srcType,inputData,function(err,result,params,host) {
    if (err) return console.error(err);

    console.log(host+':\n'+result + JSON.stringify(params));
});
```

该方法的签名为：

> runner.run(srcCode, srcType, inputData, callback)

说明：
> * srcCode 要进行编译的源码
> * srcType 源码类型，目前可选的有四个值
>   * 'c'	c代码，使用clang编译
>   * 'cpp'	c\+\+代码，使用clang++编译
>   * 'pas'	pascal代码，使用freepascal编译
>   * 'bas'	QBasic代码，使用freebasic的QB模式编译
> * inputData 编译后程序需要的输入数据
> * callback 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * result {string} 输出结果
>   * params {object} 包含运行时间和内存参数的键值对
>   * host {string} 表明这个请求是哪一个主机负责的


## 访问OJDebugger的API
访问OJDebugger的API数量较多，但是基本和OJDebugger本身提供的接口一一对应，使用方法示例如下：
```javascript
//app.js为ojclient的入口文件
//取出其中的debugger成员，该成员即访问ojdebuger的客户端对象
var dbr = require('./app.js').debugger;

//这里示范一个打断点的操作
dbr.breakPoint(debugId,breakLines,function(err,breakPointNum) {
    if (err) return console.error(err);

    console.log(breakPointNum+' break points prepared');
});
```
所有访问OJDebugger的API列举如下：
#### 1. debug
开启一个debug会话
签名：
> dbr.debug(srcCode, srcType, inputData, callback)

说明：
> * srcCode {string} 要进行编译的源码
> * srcType {string} 源码类型，目前可选的有四个值
>   * 'c'	c代码，使用clang编译
>   * 'cpp'	c\+\+代码，使用clang++编译
>   * 'pas'	pascal代码，使用freepascal编译
>   * 'bas'	QBasic代码，使用freebasic的QB模式编译
> * inputData {string} 编译后程序需要的输入数据
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * debugId {string} debug会话的凭证，之后所有的debug操作都需要这个凭证

#### 2. breakPoint
在当前debug会话中打一个断点
签名：
> dbr.breakPoint(debugId, breakLines, callback)

说明：
> * debugId {string} debug凭证
> * breakLines {number[]} 要打的断点的行数
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * breakPointNum {number} 成功打下断点的个数

#### 3. printVal
查看一个变量的值
签名：
> dbr.breakPoint(debugId, varName, callback)

说明：
> * debugId {string} debug凭证
> * varName {string} 要查看的变量名称
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * value {string|number} 查询到的变量值

#### 4.locals
查看局部变量列表
签名：
> dbr.breakPoint(debugId, callback)

说明：
> * debugId {string} debug凭证
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * locals {object} 所有局部变量的键值对

#### 5.run | stepInto | stepOver | continue
开始debug | 单步进入 | 单步越过 | 继续
这几个动作的请求（除了具体的动作字符串）和返回是一样的，因此写在一起，以下均以 **stepInto** 为例，可替换成其他动作。
签名：
> dbr.stepInto(debugId, callback)

说明：
> * debugId {string} debug凭证
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * finish {boolean} 被调试的程序是否结束
>   * breakPoint {object} 断点信息
>   * stdout {string} 标准输出的值
>   * locals {object} 局部变量键值对

#### 6.exit
退出debugger会话
签名：
> dbr.exit(debugId, callback)

说明：
> * debugId {string} debug凭证
> * callback {function} 编译执行成功后的回调函数，入参分别为
>   * err {object} 错误对象
>   * debugId {string} 结束的debug会话的凭证，等于之前传入的debugId

## 通用API
有些api并不是特定用来访问ojrunner或者Ojdebugger的，这些API主要用于设定host或者端口参数。
其中，主机和端口是指要访问的ojdebugger或者ojrunner**所在主机位置**（IP地址）以及**所监听的端口**。

*言下之意，要访问的ojdebugger或者ojrunner未必在本机，可以在远程部署*

简单示例如下：
```javascript
client = require('./app.js').runner;
//client = require('./app.js').debugger;

//设定主机
client.setHost(host);
client.setPort(port);
```















