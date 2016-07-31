var mongoose = require('mongoose');
var config = require('../config');

/* 引入所有模型约束*/
require('./note');
require('./user');
/* 引入所有模型约束 结束 */

mongoose.Promise = global.Promise;
mongoose.connect(config.db);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + config.db);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connected error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.once('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
