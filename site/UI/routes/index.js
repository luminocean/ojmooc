var express = require('express');
var crypto=require('crypto');
var conn=require('../database/dbHelper');

var User=require('../models/User');
var Subject=require('../models/Subject');
var PracticeModel=require('../models/PracticeModel');
var RecordModel=require('../models/RecordModel');

var router = express.Router();



//session ：user ,error ,success

/* GET home page. */
router.get('/', function(req, res, next) {
  var indexObject= {
    title: '首页',
    active:'index',
    mostRecSubjects:Subject.getMostRecSubjects(4),
    mostRecTeachers:User.getMostRecTeachers(4),
    studyingClasses:[]
  };
  if(res.locals.user){
    //这里res.locals.user 不为user对象,不能调用对象方法?????
    //传递过程中为undifined的属性都去掉了?????
    if(res.locals.user instanceof User){
      console.log("it;s true");
    }else{
      console.log("it;s false");
      console.log(typeof(res.locals.user));
    }
    var temp=new User(res.locals.user);
    console.log(temp);
    console.log(temp instanceof User);
    indexObject.studyingClasses=temp.getMyStudyingClasses(4);
  }

  res.render('index',indexObject);
});

router.get('/reg', function(req, res, next) {
  res.render('reg',{title:'register',active:'reg'});
});

router.get('/login',function(req,res,next){
  res.render('login',{title:'login',active:'login'});
});


router.get('/record', function(req, res, next) {
  res.render('player/record',{title:'record',active:'record'});
})

router.get('/uploadPractice', function(req, res, next) {
  res.render('uploadPractice',{title:'上传习题',active:''});
});

//一般为？pID=..
router.get('/showPractice', function(req, res, next) {
  var showObject=null;
  var pid=-1;
  if(req.query.pID){
    pid=req.query.pID;
  }
  //临时直接返回,应在if判断里
  PracticeModel.get(pid,function(err,practice){
     showObject={
      title:'查看习题',
      active:'',
      showPractice:practice
    };
    console.log("there");
    console.log(showObject.showPractice);
    res.render('showPractice',showObject);
  });

});

/*
 post之后需要
按照pid更新题目信息
这里不处理更改文件路径
 */
router.post('/showPractice', function(req, res, next) {
  console.log(req.body);

  var updatePractice=new PracticeModel({
    pID:req.body.hiddenpID,
    pName:req.body.pname,
    pUIDofTea:res.locals.user.uID,
    pDescrip:req.body.pdescrip,
    pFormatListLength:parseInt(req.body.hiddenFormatLength),
    pInputFormat:req.body.pinputformat,
    pOutputFormat:req.body.poutputformat,
    pInputFormatList:[],
    pOutputFormatList:[]
  });
  var len=updatePractice.pFormatListLength;
  for(var i=1;i<=len;i++){
    updatePractice.pInputFormatList.push(req.body['pinputformat'+i]);
    updatePractice.pOutputFormatList.push(req.body['poutputformat'+i]);
  }
  updatePractice.update(function(){
    res.redirect('/showPractice?pID=12345');//保存新题目之后哈是在这个题目界面，题目信息重新拿
  });
});

/*
post之后需要
1.存储习题本身
2.存储到老师习题库
 */
router.post('/uploadPractice', function(req, res, next) {
  console.log(req.body);
  var parentID=req.body.hiddenParentID;
  var newPractice=new PracticeModel({
    pID:null,
    pName:req.body.pname,
    pUIDofTea:res.locals.user.uID,
    pDescrip:req.body.pdescrip,
    pFormatListLength:parseInt(req.body.hiddenFormatLength),
    pInputFormat:req.body.pinputformat,
    pOutputFormat:req.body.poutputformat,
    pInputFormatList:[],
    pOutputFormatList:[]
  });
  var len=newPractice.pFormatListLength;
  for(var i=1;i<=len;i++){
    newPractice.pInputFormatList.push(req.body['pinputformat'+i]);
    newPractice.pOutputFormatList.push(req.body['poutputformat'+i]);
  }
  newPractice.save(parentID,function(){
    //res.render('showPractice',{title:'查看习题',active:''});
    res.redirect('/myclass?redir=upPra');//正常跳转到习题库，之前的调用callback，处理数据库存储
  });
});

router.get('/classes', function(req, res, next) {
  var classesObject={
    title: '课程',
    active:'classes',
    allSubjectsShowObject:Subject.getAllSubjectShow(),
    allTeachers:User.getAllTeacher()
  };
  res.render('classes',classesObject);
});


router.get('/myClass', function(req, res, next) {

  if(res.locals.user.uIdentity===1){
    var myClassObjectOfT={
      title: '我的课程',
      active:'myClass',
      redir:null,
      subOfMineList:Subject.getSubsOfTeacher(res.locals.user.uID),//老师课程展示
      allInfoOfTeacher:res.locals.user.getallInfoOfTeacher()//个人信息，视频，习题库展示
    };
    if(req.query.redir){
      myClassObjectOfT.redir=req.query.redir;
    }
    res.render('myClassOfTeacher',myClassObjectOfT);
  }else{
    var myClassObjectOfS={
      title: '我的课程',
      active:'myClass',
      subOfMineList:res.locals.user.getallMySubjectInfo(),
      allInfoOfTeacher:res.locals.user.getallInfoOfStudent()//个人信息，视频，习题库展示
    };
    res.render('myClassOfStudent', myClassObjectOfS);
  }
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
    console.log("mmmmmm");
    console.log(user instanceof User);
    req.session.user = user;
    req.session.success='登入成功';
    res.redirect('/');
  });
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.success='登出成功';
  res.redirect('/');
});

module.exports = router;
