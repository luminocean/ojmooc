var express = require('express');
var router = express.Router();
var User=require('../models/User');
var Subject=require('../models/Subject');

/* GET ajax listing. */
//获取视频库列表
router.get('/getRecordList', function(req, res, next) {
    res.send(res.locals.user.getRecordListJson());
});

//获取习题哭列表
router.get('/getPracticeList', function(req, res, next) {
    res.send(res.locals.user.getPracticeListJson());
});

//处理视频库的操作
router.get('/recordList', function(req, res, next) {
    console.log("/recordList :"+req.query);
    res.locals.user.handleRecordUpdate(req.query,res,function(){
        //处理完，回调返回
        //或者传进去res，直接那里返回，这里不用写了
    });

});

//处理视频库的操作
router.get('/practiceList', function(req, res, next) {
    console.log("/practiceList :"+req.query);
    res.locals.user.handlePracticeUpdate(req.query,res,function(){
        //处理完，回调返回
        //或者传进去res，直接那里返回，这里不用写了
    });

});

//关闭老师我的课程页面。老师把视频库，习题库更改统一写入数据库
router.get('/myClassesOfteacherclose', function(req, res, next) {
    console.log(req.query.id);
    res.locals.user.myClassClose();
    res.send("true");
});



module.exports = router;
/**
 * Created by zy on 2015/4/8.
 */
