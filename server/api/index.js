var express = require('express');

//加载配置
var config = require('../config');

var app = express();

/******************REST API*******************/
app.use('/', require('./routes/free'));
app.use('/', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(app);
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
    res.json('error', {
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
  res.json('error', {
      status: status,
      message: err.message,
      error: err
    });
});

module.exports = app;
