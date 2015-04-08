var express = require('express');
var router = express.Router();
var User=require('../models/User');
var Subject=require('../models/Subject');

/* GET ajax listing. */
router.get('/getRecordList', function(req, res, next) {
    res.send(res.locals.user.getRecordListJson());
});

router.get('/hello', function(req, res, next) {
    res.send("hello333332222~"+new Date().toString());
});

router.get('/:username', function(req, res, next) {
    res.send("hello56~"+new Date().toString()+req.params.username);
});

module.exports = router;
/**
 * Created by zy on 2015/4/8.
 */
