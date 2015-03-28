/**
 * 本文件定义了ojdebugger内部各种方法的配置
 */

/**
 * debugger会用到的parse方法的定义
 */
var parseConfig = {
    //parser提供的parse方法
    "parseStopPoint":{
        //解析某一行获取有用的信息,在最后返回的结果中可能会有以该属性为key的一个对象（并非一定有）
        //该对象自身的属性即attrNames里指定的那些
        "breakPoint":{
            //解析用正则
            "reg": /~"(\d+)(?:\\t)+(.*)(?:\\n)*/,
            //解析完成后返回的对象所包含的属性
            "attrNames":["lineNum","text"]
        },
        "endSteppingRange":{
            "reg": /\*stopped,reason="(end\-stepping\-range)"/,
            "attrNames":["msg"],
            //表示运行是否结束的flag
            "finish":true
        },
        "notRunning":{
            "reg": /&"(The program is not being run)/,
            "attrNames":["msg"],
            "finish":true
        },
        "noFileOrDirectory":{
            "reg": /(No such file or directory)/,
            "attrNames":["msg"],
            "finish":true
        }
    },
    "parseBreakPoint":{
        "added":{
            "reg": /~"Breakpoint (\d)/,
            "attrNames":["breakPointId"]
        },
        "removed":{
            "reg": /=breakpoint-deleted,id="(\d)"/,
            "attrNames":["breakPointId"]
        },
        "noLine":{
            "reg": /&"(No line \d)/,
            "attrNames":["msg"]
        },
        "noBreakPoint":{
            "reg": /&"No breakpoint at (\d)/,
            "attrNames":["msg"]
        }
    },
    "parseExit":{
        "normalExit":{
            "reg":/\(process\s(\d+)\)\sexited normally/,
            "attrNames":["processId"],
            "finish":true
        }
    },
    "parsePrintVal":{
        "noSymbol":{
            "reg":/&"(No symbol \\".*\\" in current context)/,
            "attrNames":["msg"]
        },
        "var":{
            //表示该属性手动构建,不再进行自动处理
            "manual":true
        }
    },
    "parseLocals":{
        "noFrame":{
            "reg":/&"(No frame selected)/,
            "attrNames":["msg"]
        },
        "noLocals":{
            "reg":/~"(No locals.)/,
            "attrNames":["msg"]
        },
        "locals":{
            "manual":true
        }
    },
    //作用就是殿后，防止一个gdb的info输出没有方法去截获
    "parseInfo":{
        "running":{
            "reg":/\*(running)/,
            "attrNames":["msg"],
            //是否仅是信息输出，是的话不会作为结果返回，类似于log的作用，不是核心业务
            "info":true
        },
        "stopped":{
            "reg":/\*(stopped)/,
            "attrNames":["msg"],
            "info":true
        }
    }
};

/**
 * debugger对外提供的方法的配置，最重要
 */
var methods = {
    "debug":{},
    "exit":{},
    "breakPoint":{
        "parseNames":['parseBreakPoint','parseInfo']
    },
    "removeBreakPoint":{
        "parseNames":['parseBreakPoint','parseInfo']
    },
    "printVal":{
        //该方法需要的解析方法的名称，对应parseConfig里面配置的方法
        //配置了这个属性表示返回结果将由parser生成
        "parseNames":['parsePrintVal','parseInfo']
    },
    "locals":{
        "parseNames":['parseLocals','parseInfo']
    },
    "run":{
        "parseNames":['parseStopPoint','parseExit','parseInfo'],
        //是否在返回值上带有标准输出
        "stdout":true,
        //是否在返回值上带上局部变量列表
        "locals":true
    },
    "continue":{
        "parseNames":['parseStopPoint','parseExit','parseInfo'],
        //提供了command表示该方法的debugger实现将自动生成
        "command":"c",
        "stdout":true,
        "locals":true
    },
    "stepInto":{
        "parseNames":['parseStopPoint','parseExit','parseInfo'],
        "command":"step",
        "stdout":true,
        "locals":true
    },
    "stepOver":{
        "parseNames":['parseStopPoint','parseExit','parseInfo'],
        "command":"next",
        "stdout":true,
        "locals":true
    }
};

/**
 * ojdebugger本身的一些配置属性，其中的根目录指项目的根目录
 */
var settings = {
    /**
     * app本身的配置选项
     */
    "app":{
        "port":23333,
        //"port":8081,
        //一个gdb进程无操作等待的最长时间，超时则gdb进程被回收
        "gdbTimeout":120
    },
    /**
     * 项目路径相关配置
     */
    "repo": {
        //源码文件、可执行文件、报告文件所在的目录
        "dir": {
            "base":"/tmp/ojdebugger/repo",
            "src": "/tmp/ojdebugger/repo/src",
            "build": "/tmp/ojdebugger/repo/build",
            "input": "/tmp/ojdebugger/repo/input",
            "output": "/tmp/ojdebugger/repo/output"
        },
        //清理dir中各路径的某文件时搜索的扩展名
        //比如要清理程序abc的各中间文件，则会依次搜索abc,abc.cpp,abc.pas等等
        "cleanExt": [
            "",
            "cpp",
            "pas",
            "txt",
            "bas"
        ]
    },
    /**
     * shell文件相关配置
     */
    "shell":{
        "base":"./shell",
        "compile":"./shell/compile.sh"
    },
    /**
     * 编译相关配置
     */
    "compile":{
        //某种源码后缀使用的编译器的配置
        "compiler":{
            "c":"gcc",
            "cpp":"g++",
            "pas":"fpc",
            "bas":"fbc"
        },
        "limit":{
            //编译时的时间限制
            "timeout": 10000
        }
    }
};

exports.methods = methods;
exports.parseConfig = parseConfig;
exports.settings = settings;