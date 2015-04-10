/**
 * Created by blueking on 2015/4/8.
 */

var fs = require('fs');
var express = require('express');
var route=express.Router();
var dataPersist = require('../database/data_persist');



route.post('/recordOver', function (req,res) {
    //将数据进行存储
    var vedioInfos = req.body.vedioInfos;
    var audio = req.body.audioContent;
    var rID = req.body.rID;
    //视频数据存储的路径
    var baseDir = "../UI/public/vediodata";
    //视频名称，分为其他数据和音频两部分，分别存在不同文件里面
    console.log(req.body);
    //var vedioName = audio.name.split('.')[0];
    //将视频信息的值存入json文件
    //fs.writeFile(baseDir + '/' + rID + '.json',vedioInfos,function(e){//会先清空原先的内容
    //    if(e) {
    //        console.log(e);
    //    };
    //})

    //var audioRootName = file.name.split('.').shift(),
    //    audioExtension = file.name.split('.').pop(),    //语音文件类型
    //    audioBuffer;
    //
    //audio.contents = audio.contents.split(',').pop();
    //
    //audioBuffer = new Buffer(audio.contents, "base64");
    //
    //fs.writeFileSync(baseDir + '/' + audioRootName + '.' + audioExtension, audioBuffer);


    //数据库存储对应文件的路径
    //dataPersist.insert_course_info({rID:rID,vedioDir:baseDir,vedioName:"vedioName"});
    var result = {"info":"save success"};
    res.send(result);
    res.end();
});

route.post('/loadVedio',function(req,res){
    dataPersist.query_course_info(conditon,value,function(err,result){
        //查询数据库，读取数据，并传到页面
        res.send(result);
        res.end();
    });
});

module.exports=route;

