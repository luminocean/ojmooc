var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});

//router.get('/users', function(req, res, next) {
//  res.send("usersss~"+new Date().toString());
//});

router.get('/hello', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/post', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/reg', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/login', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/logout', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});
router.get('/hello', function(req, res, next) {
  res.send("hello~"+new Date().toString());
});

module.exports = router;
