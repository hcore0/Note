/**
 * 主应用
 */

//加载环境变量
require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

//链接数据库 加载数据对象
require('./server/models/db');

//加载配置
var config = require('./server/config');

var app = express();

//加载socket.io监听
app.ready = function (server) {
  require('./server/app').ready(server);
};

//静态文件
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//子应用 rest api
app.use('/api', require('./server/api'));

//子应用 应用系统
app.use('/', require('./server/app'));

module.exports = app;
