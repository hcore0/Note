/**
 * rest api server
 */

var express = require('express');
var app = express();

//加载路由
require('./routes')(app);

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
