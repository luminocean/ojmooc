/**
 * 本文件定义了ojdebugger内部各种方法的配置
 */

/**
 * debugger会用到的parse方法的定义
 */
var parseConfig = {
    //parser对外提供的方法
    "parseStopPoint":{
        //解析某一行获取有用的信息
        "breakPoint":{
            //解析用正则
            "reg": /~"(\d+)(?:\\t)+(.*)(?:\\n)*/,
            //解析完成后返回的对象所包含的属性
            "meta":["lineNum","text"]
        }
    },
    "parsePrintVal":{
        "var":{
            "reg":/~"\$\d+\s=\s(.+)"/,
            "meta":["value"]
        },
        "noSymbol":{
            "reg": /&"No symbol \\"(.*)\\" in current context/,
            "meta":["varName"]
        }
    },
    "parseExit":{
        "normalExit":{
            "reg":/\(process\s(\d+)\)\sexited normally/,
            "meta":["processId"]
        }
    }
};

/**
 * debugger对外提供的方法的配置，最重要
 */
var methods = {
    "debug":{
      //该方法需要从请求中读取的参数的名称
      "paramNames":["srcCode","srcType","inputData"],
      "result":{
          //之后的会话中一直要使用的id
          "debugId":undefined
      }
    },
    "exit":{
        "paramNames":["debugId"],
        "result": {
            "debugId":undefined
        }
    },
    "breakPoint":{
        "paramNames":["debugId","breakLines"],
        "result":{
            //成功加入的断点的个数
            "breakPointNum":undefined
        }
    },
    "printVal":{
        "paramNames":["debugId","varName"],
        "parseNames":['parsePrintVal']
    },
    "run":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        "stdout":true
    },
    "continue":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        //提供了command表示该方法的debugger实现将自动生成
        "command":"c",
        "stdout":true
    },
    "stepInto":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        "command":"step",
        "stdout":true
    },
    "stepOver":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        "command":"next",
        "stdout":true
    }
};

/**
 * ojdebugger本身的一些配置属性，其中的根目录指项目的根目录
 */
var settings = {
    /**
     * 项目路径相关配置
     */
    "repo": {
        //源码文件、可执行文件、报告文件所在的目录
        "dir": {
            "base":"/repo",
            "src": "/repo/src",
            "build": "/repo/build",
            "input": "/repo/input",
            "output": "/repo/output"
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
        "base":"/shell",
        "compile":"/shell/compile.sh"
    },
    /**
     * 编译相关配置
     */
    "compile":{
        //某种源码后缀使用的编译器的配置
        "compiler":{
            "c":"clang",
            "cpp":"clang++",
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