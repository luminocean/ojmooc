var express = require('express');
var crypto=require('crypto');
var conn=require('../database/dbHelper');

var User=require('../models/User');
var Subject=require('../models/Subject');

var router = express.Router();



//session ：user ,error ,success

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '首页',
    active:'index',
    mostRecSubjects:Subject.getMostRecSubjects(4),
    mostRecTeachers:User.getMostRecTeachers(4),
    studyingClasses:User.getMyStudyingClasses(4)
  });
});

router.get('/reg', function(req, res, next) {
  res.render('reg',{title:'register',active:'reg'});
});

router.get('/play', function(req, res, next) {
  res.render('player/play',{title:'play',active:'play'});
});

router.get('/login',function(req,res,next){
  res.render('login',{title:'login',active:'login'});
});

router.get('/classes', function(req, res, next) {
  res.render('classes', { title: '课程',active:'classes'});
});

router.get('/myClass', function(req, res, next) {
  res.render('myClass', { title: '我的课程',active:'myClass'});
});



//test
router.get('/login:username', function(req, res, next) {

  //(function(){
  //  res.send("aooo~");
  //})();

  ////闭包理解
  //function createFun(){
  //  var a= new Array();
  //
  //  for(var i=0;i<10;i++){
  //    a[i]=function(){
  //      return i;
  //    };
  //  }
  //
  //  return a;
  //}
  //
  //for(var i=0;i<10;i++){
  //  console.log("v "+i+" "+createFun()[i]());
  //}
  //
  //console.log(createFun());
  //
  //res.send(createFun());

  //cookie
  //res.cookie('cookiename','i am a cookie',{ maxAge: 20000,httpOnly:true, path:'/'});
  //res.send(req.user+" "+req.uid+" "+req.cookies.cookiename);
  //res.cookie('cookiename','null',{maxAge:0});

  //session
  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send('hello, session id:' + req.sessionID + ' count:' + n+"  "+req.params.username);
  console.log(req.session);
  console.log(req.cookies);
  console.log(req.params);
  console.log(req.query);
  console.log(req.body);
  console.log(req.path);
});

router.post('/reg', function(req, res, next) {
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.session.error='两次输入的口令不一致';
    console.log(req.session.error);
    return res.redirect('/reg');
  }
  ////生成口令的散列值
  //var md5 = crypto.createHash('md5');
  //var password = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    uUserName: req.body.username,
    uPassWord: req.body.password,
    uIdentity:0
  });

  //检查用户名是否已经存在
  User.check(newUser.uUserName, function(err) {
    if (err) {
      req.session.error=err;
      console.log("check1err: "+err);
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save( function(err) {
      if (err) {
        req.session.error=err;
        console.log("check2err: "+err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.session.success='注册成功';
      console.log(req.session.success);
      res.redirect('/');
    });
  });
});

router.post('/login', function(req, res, next) {
  ////生成口令的散列值
  //var md5 = crypto.createHash('md5');
  //var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user) {
    if (!user) {
      req.session.error='用户不存在';
      return res.redirect('/login');
    }
    if (user.uPassWord != req.body.password) {
      req.session.error='密码错误';
      return res.redirect('/login');
    }
    req.session.user = user;
    req.session.success='登录成功';
    res.redirect('/');
  });
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.success='登出成功';
  res.redirect('/');
});

module.exports = router;
