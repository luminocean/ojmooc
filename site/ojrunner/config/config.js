/*
 * 项目的配置文件，由于需要使用一些注释所以本文件为js文件而非json文件
 *
 * 约定：配置中出现的路径中所有的根目录都指的是app.js的位置即项目的根目录，而不是文件系统的根目录
 * 这样的指定方便程序中直接拼接
 */
var config={
  /**
   * 项目路径相关配置
   */
  "repo": {
    //源码文件、可执行文件、报告文件所在的目录
    "dir": {
      "src": "/src_repo",
      "build": "/build_repo",
      "report": "/report_repo"
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
    //执行编译任务的shell的路径
    "shell":"/shell/compile.sh"
  },
  /**
   * 执行相关配置
   */
  "exec":{
    "shell":"/shell/exec.sh"
  }
};

module.exports=config;

