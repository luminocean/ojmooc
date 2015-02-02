/**
 * 本文件定义了ojdebugger内部各种方法的配置
 */

/**
 * debugger会用到的parse方法的定义
 */
var parseConfig = {
    "parseStopPoint":{
        "breakPoint":{
            "reg": /~"(\d+)(?:\\t)+(.*)\\n/,
            "meta":["lineNum","text"]
        }
    },
    "parsePrintVal":{
        "var":{
            "reg":/~"\$\d+\s=\s(.+)"/,
            "meta":["value"]
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
        "parseNames":['parseStopPoint','parseExit']
    },
    "continue":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        //提供了command表示该方法的debugger实现将自动生成
        "command":"c"
    },
    "stepInto":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        "command":"step"
    },
    "stepOver":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
        "command":"next"
    }
};

var settings = {
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