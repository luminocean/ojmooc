var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var editorCompile = require('./routes/editorCompile');
var ajaxRequest=require('./routes/ajaxRequest');
var whiteboardImage = require('./routes/whiteboardImage');
//test用
var User=require('./models/User');

//test用


var app=express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'12345',
  resave:false,
  saveUninitialized:false
}));
app.use(express.static(path.join(__dirname, 'public')));

//app.locals({
//
//});
var newUser = new User({
  uID:11,
  uUserName:"fff",
  uPassWord:"fff",
  uIdentity:1,
  uDescrip:"vvvvvvvvvvvvvvvvvvvvv",
  uSchool:"nanjing university",
  Lastmid:56,
  uPicture:"img/test.png",
  uFollowerNum:500
});

app.use(function (req, res, next) {
  res.locals.error = req.session.error;
  res.locals.success = req.session.success;
  res.locals.user = req.session.user;
  //test
  res.locals.user=newUser;
  //
  next();
});

app.use('/ajaxRequest',ajaxRequest);
app.use('/', index);
app.use('/users', users);
app.use('/play/editor',editorCompile);
app.use('/play/whiteboard',whiteboardImage);
//app.get('/hello',routes);
//app.get('/hello',users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(80);

module.exports=app;
