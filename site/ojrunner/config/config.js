/*
 * 项目的配置文件，由于需要使用一些注释所以本文件为js文件而非json文件
 *
 * 约定：配置中出现的路径中所有的根目录都指的是文件系统的根目录
 * 所有.（当前目录）的位置即项目的根目录
 */
var config={
    /**
     * app本身的配置选项
     */
    "app":{
        "port":23333
    },
    /**
    * 项目路径相关配置
    */
    "repo": {
        //源码文件、可执行文件、报告文件所在的目录
        "dir": {

            "base":"/tmp/ojrunner/repo",
            "src": "/tmp/ojrunner/repo/src",
            "build": "/tmp/ojrunner/repo/build",
            "report": "/tmp/ojrunner/repo/report"
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
        "compile":"./shell/compile.sh",
        "exec":"./shell/exec.sh"
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
    },
    /**
    * 执行相关配置
    */
    "exec":{
        "limit":{
          //运行的时间限制
          "timeout": 15000
        }
    }
};

module.exports=config;

