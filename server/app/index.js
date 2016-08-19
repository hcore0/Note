/**
 * app server
 */

var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//加载配置
var config = require('../config');

var app = express();

// 使用handlerbars
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', handlebars({
  defaultLayout: 'layout/main',
  extname: '.html',
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: require('./utils/helpers')
}));
app.set('view engine', '.html');

app.use(cookieParser());

//使用内存存储session
var memoryStore = new session.MemoryStore();
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

/*加载websocket模块*/
app.ready = function (server) {
  require('../websocket').listen(server, memoryStore);
};

//消息处理
app.use(require('./interceptors/message'));

//加载路由
require('./routes')(app);

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
    res.format({
      html: function () {
        res.render('error', {
          status: status,
          message: err.message,
          error: err
        });
      },
      json: function () {
        res.json('error', {
          status: status,
          message: err.message,
          error: err
        });
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  var status = err.status || 500;
  res.status(status);
  res.format({
      html: function () {
        res.render('error', {
          status: status,
          message: err.message,
          error: {}
        });
      },
      json: function () {
        res.json('error', {
          status: status,
          message: err.message,
          error: {}
        });
      }
    });
});

module.exports = app;
