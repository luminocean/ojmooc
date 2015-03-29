var express = require('express');
var crypto=require('crypto');
var conn=require('../database/dbHelper');
var User=require('../models/User');

var router = express.Router();

//function Navbar(name ,className){
//  this.name=name;
//  this.className=className;
//};
//
//var headerNavbar=[
//    new Navbar('首页',''),
//    new Navbar('登入',''),
//    new Navbar('登出',''),
//    new Navbar('录制','')
//
//];

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: '首页',active:'index'});
});

router.get('/reg', function(req, res, next) {
  res.render('reg',{title:'register',active:'reg'});
});

router.get('/login',function(req,res,next){

});

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
    name: req.body.username,
    password: req.body.password,
    identity:1
  });

  //检查用户名是否已经存在
  User.check(newUser.name, function(err) {
    if (err) {
      req.session.error=err;
      console.log(err);
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save( function(err) {
      if (err) {
        req.session.error=err;
        console.log("333"+err);
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
  res.send("hello~"+new Date().toString());
})

router.get('/logout', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});


router.get('/play', function(req, res, next) {
  res.render('play',{title:'play',active:'play'});
});

module.exports = router;
