var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.get('/hello', function(req, res, next) {
  res.send("hello333332222~"+new Date().toString());
});

router.get('/:username', function(req, res, next) {
  res.send("hello56~"+new Date().toString()+req.params.username);
});

module.exports = router;
