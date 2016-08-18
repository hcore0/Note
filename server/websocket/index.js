var socket = require('socket.io');

module.exports.listen = function (app, memoryStore) {
  var io = socket(app);

  //注册所有模块
  require('./modules/chat').add(io, memoryStore);
  require('./modules/paint').add(io, memoryStore);
};

