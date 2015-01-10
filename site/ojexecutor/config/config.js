/*
 * 项目的配置文件，由于需要使用一些注释所以本文件为js文件而非json文件
 *
 * 约定：配置中出现的路径中所有的根目录都指的是app.js的位置即项目的根目录，而不是文件系统的根目录，
 * 这样的指定方便程序中直接拼接
 */
var config={
  /**
   * 项目路径相关配置
   */
  "repo": {
    //可执行文件、报告文件所在的目录
    "dir": {
      "build": "/repo/build",
      "report": "/repo/report"
    },
    //清理dir中各路径的某文件时搜索的扩展名
    //比如要清理程序abc的各中间文件，则会依次搜索abc,abc.cpp,abc.pas等等
    "cleanExt": [
      "",
      "txt"
    ]
  },
  /**
   * shell文件相关配置
   */
  "shell":{
    "base":"/shell",
    "exec":"/shell/exec.sh"
  }
};

module.exports=config;

