//环境变量
require('dotenv').load();

var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//链接数据库 加载数据对象
require('./app_server/models/db');

//加载配置
var config = require('./app_server/config');

//加载不需要身份认证的路由
var freeRoutes = require('./app_server/routes/free');

//加载需要身份认证的路由
var authRoutes = require('./app_server/routes/auth');

var app = express();

// 使用handlerbars
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.engine('.html', handlebars({
  //defaultLayout: 'main', 不使用模板
  extname: '.html',
  layoutsDir: 'app_server/views',
  helpers: require('./app_server/utils/helpers')
}));
app.set('view engine', '.html');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: config.sessionSecret}));

//消息处理
app.use(require('./app_server/utils/interceptors/message'));

//不需要身份认证的路由放在前边
app.use('/', freeRoutes);

app.use(require('./app_server/utils/interceptors/authentication'));

app.use('/', authRoutes);

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
    console.log(err.stack);
    var status = err.status || 500;
    res.status(status);
    res.render('error', {
      status: status,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  var status = err.status || 500;
  res.status(status);
  res.render('error', {
    status: status,
    message: err.message,
    error: {}
  });
});

module.exports = app;
