module.exports.add = function (io) {

  //使用chat命名空间
  var paintIO = io.of('/paint');

  paintIO.on('connection', function (socket) {
      socket.on('addDraw', function (data) {
        socket.broadcast.emit('draw', {
            data: data
        });
      });
  });
};