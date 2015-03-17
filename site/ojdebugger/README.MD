# OJDebugger

## 简述
在ojmooc后台提供debug服务的模块，其基本特点是：

* 本身是一个node的web项目，启动后将会监听某一个端口提供http服务
* 所有的操作基于POST请求，请求内部包含操作相关的json数据

目前提供的操作有：
> * 开启debug (debug)
> * 打断点 (breakPoint)
> * 查看变量值 (printVal)
> * 查看局部变量列表 (locals)
> * 单步进入 (stepInto)
> * 单步越过 (stepOver)
> * 继续 (continue)
> * 结束debug (exit)

## API 说明

>注意，一般情况下没有必要直接调用ojdebugger的服务。因为子项目ojclient封装了所有构造请求的操作，对外提供了更友好的接口。因此建议y业务上直接使用ojclient的接口。以下仅作为参考文档使用

如上所述，ojdebugger对外提供多个api，要调用只需向其监听的端口发送POST请求即可。
比如当ojdebugger运行在本机上、监听23333端口时，只要向url：
```url
http://localhost:23333
```
发送请求：
```javascript
{
    "apiName":{
        "arg1":"value1",
        "arg2":"value2",
        "arg3":"value3"
    }
}
```
即可完成服务的调用。返回值也是一个json对象：
```javascript
{
    "resultData1":"data1",
    "resultData2":"data2",
    "resultData3":"data3"
}
```
具体例子请看API列表

# API 列表

以下列出所有debug请求的json对象：

### 1. debug
开启一个debug会话

```javascript
//请求
{
    "debug":{
        "srcCode":srcCode,      //要debug的源码
        "srcType":srcType,      //源码类型
        "inputData":inputData   //该程序的输入数据
    }
}
```

```javascript
//响应
{
    "debugId":debugId   //debug会话的凭证，之后所有的操作都是基于这个debugId进行的
}
```

### 2. breakPoint
在当前debug会话中打一个断点

```javascript
//请求
{
    "breakPoint":{
        "debugId":debugId,  //从之前的debug操作响应中取得的debug凭证
        "breakLines":breakLines //要打的断点的行数，是一个数组，即可以一次打多个断点
    }
}
```

```javascript
//响应
{
    "breakPointNum":num //成功加入的断点的个数
}
```

### 3.printVal
查看一个变量的值

```javascript
//请求
{
    "printVal":{
        "debugId":debugId,
        "varName":varName //要查看的变量名
    }
}
```

```javascript
//响应（正常返回）
{
    "var":{
        "id":id, //gdb内部标识变量的代号，业务中不用管它
        "value":value   //要查询的变量的值
    }
}

//响应（变量不存在）
{
    "noSymbol":{
        "msg":msg //错误消息，判断的时候只需要看响应有没有noSymbol属性即可
    }
}
```

### 4.locals
查看局部变量列表

```javascript
//请求
{
    "locals":{
        "debugId":debugId
    }
}
```

```javascript
//响应（正常返回）
{
    "locals":{
        "key1":"value1",    //局部变量的键值对
        "key2":"value2",
        "key3":"value3"
    }
}

//响应（没有本地变量）
{
    "noLocals":{
        "msg":msg
    }
}

//响应（没有选择帧）
//我也不知道这是啥。。。-_- gdb有时会返回这个
{
    "noFrame":{
        "msg":msg
    }
}
```

### 5.run | stepInto | stepOver | continue

开始debug | 单步进入 | 单步越过 | 继续
这几个动作的请求（除了具体的动作字符串）和返回是一样的，因此写在一起，以下均以 **stepInto** 为例，可替换成其他动作。

*强调注：下文中所有说到单步的地方都泛指run,stepInto,stepOver,continue动作*

```javascript
//请求
{
    "stepInto":{
        "debugId":debugId
    }
}
```


```javascript
//响应（遇到断点）
{
    "breakPoint":{
        "lineNum":lineNum, //断点发生的行数
        "text":text,   //断点所在处的代码内容（主要做调试用，看的方便），
        "stdout":stdout, //被调试的程序产生的标准输出，每次产生的标准输出都是一次性的，不会再出现第二次。该属性不一定会出现，取决于是不是产生了标准输出
        "locals":locals	//当前所有局部变量的键值对
    }
}

//响应（运行结束）
{
    "normalExit":{
        "processId":processId,   //刚才被调试的程序在系统中的pid
        "finish":true,   //表示当前的debug操作已经结束（但gdb进程还没有退出）
        "stdout":stdout, //被调试的程序产生的标准输出，每次产生的标准输出都是一次性的，不会再出现第二次。该属性不一定会出现，取决于是不是产生了标准输出
        "locals":locals	//当前所有局部变量的键值对
    }
}

//响应（超出调试范围，比如单步到最后一行还往后单的时候会发生）
{
    "endSteppingRange":{
        "msg":msg,
        "finish":true
    }
}

//响应（程序未启动，程序还没有进入run的状态或者已经结束了run的时候再单步会发生）
{
    "notRunning":{
        "msg":msg,
        "finish":true
    }
}

//响应（某些环境下gdb会出现这种错误）
{
    "noFileOrDirectory":{
        "msg":msg,
        "finish":true
    }
}
```

### 6. exit
退出debugger会话

```javascript
//请求
{
    "exit": {
        "debugId":debugId
    }
}
```

```javascript
//响应
{
    "debugId":debugId //退出的debugger会话的debugId
}
```