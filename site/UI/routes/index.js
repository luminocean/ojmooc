var express = require('express');
var crypto=require('crypto');
var conn=require('../database/dbHelper');
var User=require('../models/User');

var router = express.Router();

var insertSQL = 'insert into t_user(name) values("conan"),("fens.me")';
var selectSQL = 'select * from t_user limit 10';
var deleteSQL = 'delete from t_user';
var updateSQL = 'update t_user set name="conan update"  where name="conan"';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//router.get('/users', function(req, res, next) {
//  res.send("usersss~"+new Date().toString());
//});

router.post('/post', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/reg', function(req, res, next) {
  res.render('reg',{title:'register'});
});
router.get('/login', function(req, res, next) {
  //res.cookie('cookiename','i am a cookie',{ maxAge: 20000,httpOnly:true, path:'/'});
  //res.send(req.user+" "+req.uid+" "+req.cookies.cookiename);
  //res.cookie('cookiename','null',{maxAge:0});
  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send('hello, session id:' + req.sessionID + ' count:' + n);
  console.log(req.session);
  console.log(req.cookies);
});

router.post('/reg', function(req, res, next) {
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', ' 两次输入的口令不一致');
    return res.redirect('/reg');
  }
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
    name: req.body.username,
    password: password
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function(err, user) {
    if (user)
      err = 'Username already exists.';
    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save( function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', ' 注册成功');
      res.redirect('/');
    });
  });
});
router.post('/login', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/logout', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});

router.get('/hello', function(req, res, next) {
  ////delete
  //conn.query(deleteSQL, function (err0, res0) {
  //  if (err0) console.log(err0);
  //  console.log("DELETE Return ==> ");
  //  console.log(res0);
  //
  //  //insert
  //  conn.query(insertSQL, function (err1, res1) {
  //    if (err1) console.log(err1);
  //    console.log("INSERT Return ==> ");
  //    console.log(res1);
  //
  //    //query
  //    conn.query(selectSQL, function (err2, rows) {
  //      if (err2) console.log(err2);
  //
  //      console.log("SELECT ==> ");
  //      for (var i in rows) {
  //        console.log(rows[i]);
  //      }
  //
  //      //update
  //      conn.query(updateSQL, function (err3, res3) {
  //        if (err3) console.log(err3);
  //        console.log("UPDATE Return ==> ");
  //        console.log(res3);
  //
  //        //query
  //        conn.query(selectSQL, function (err4, rows2) {
  //          if (err4) console.log(err4);
  //
  //          console.log("SELECT ==> ");
  //          for (var i in rows2) {
  //            console.log(rows2[i]);
  //          }
  //        });
  //      });
  //    });
  //  });
  //});

  //conn.end();
  res.send("hello3~"+new Date().toString());
  next();
});

router.get('/hello', function(req, res, next) {
  console.log("hello2");
});

module.exports = router;
