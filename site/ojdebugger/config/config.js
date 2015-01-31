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
      "paramNames":["programName"],
      "result":{
          //之后的会话中一直要使用的id
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
        //提供了command表示该方法的debugger实现将自动生成
        "command":"r"
    },
    "continue":{
        "paramNames":["debugId"],
        "parseNames":['parseStopPoint','parseExit'],
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

exports.methods = methods;
exports.parseConfig = parseConfig;