var socketUserMapping = {}; //socket 与昵称 映射
var socketRoomMapping = {}; //socket与所属房间 映射
var roomMapping = {
  hall: '大厅',
  room_1: '房间001',
  room_2: '房间002'
};
var rooms = [{
  id: 'hall',
  name: '大厅'
}, {
  id: 'room_1',
  name: '房间001'
}, {
  id: 'room_2',
  name: '房间002'
}];

module.exports.add = function(io, memoryStore) {
    //使用chat命名空间
    var chatIO = io.of('/chat');

    //获取房间里的所有用户
    function getUsersInRoom(room) {
        var roomObj = io.nsps['/chat'].adapter.rooms[room];
        if (!roomObj) {
          return [];
        }
        var socketsInRoom = roomObj.sockets;
        var keys = Object.keys(socketsInRoom);

        return keys.map(function(key) {
            return {
              id: key,
              name: socketUserMapping[key].nickname
            };
        });
    }

    //注册用户
    function genUserName(socket) {
        socketUserMapping[socket.id] = socket.user;
        socket.emit('nameResult', {
            socketId: socket.id,
            name: socket.user.nickname,
            photo: socket.user.thumbnail
        });
    }

    //加入房间
    function joinRoom(socket, room) {
        var oldRoom = socketRoomMapping[socket.id],
            userName = socketUserMapping[socket.id].nickname,
            oldUsers,
            currUsers;

        //如果之前在其它房间
        if (oldRoom) {
          //通知所有用户
            socket.leave(oldRoom);
            oldUsers = getUsersInRoom(oldRoom);
            socket.broadcast.to(oldRoom).emit('systemInfo', {
                text: userName + '离开了房间' + roomMapping[oldRoom],
                userList: oldUsers,
                roomList: rooms
            });
            socket.broadcast.to(oldRoom).emit('refreshRooms', rooms);
            //通知旧房间的用户刷新用户列表
            socket.broadcast.to(oldRoom).emit('refreshUsers', oldUsers);
        }

        socket.join(room);
        socketRoomMapping[socket.id] = room;
        currUsers = getUsersInRoom(room);

        socket.emit('joinResult', {
            id: room,
            name: roomMapping[room]
        });
        socket.emit('systemInfo', {
            text: userName + '进入了房间' + roomMapping[room]
        });
        socket.broadcast.to(room).emit('systemInfo', {
            text: userName + '进入了房间' + roomMapping[room]
        });
        socket.broadcast.to(room).emit('refreshRooms', rooms);
        //通知新房间的用户刷新用户列表
        socket.broadcast.to(room).emit('refreshUsers', currUsers);

        socket.emit('refreshRooms', rooms);
        socket.emit('refreshUsers', currUsers);
    }

    //获取登陆用户信息
    chatIO.use(function(socket, next) {
        var cookie = require('cookie').parse(socket.request.headers.cookie);
        var unsignedCookies = require('cookie-signature').unsign(cookie['connect.sid'].slice(2), require('../../config').sessionSecret);
        var obj = memoryStore.sessions[unsignedCookies];

        if (!obj) {
            next({
              status: 403,
              message: '会话已经过期'
            });
        } else {
            socket.user = JSON.parse(obj).user;
            next();
        }
    });

    chatIO.on('connection', function(socket) {
        genUserName(socket); //获取用户名
        joinRoom(socket, 'hall'); //默认加入大厅

        socket.on('message', function(data) {

          if (!!data.wisperTo) {
              chatIO.sockets[data.wisperTo].emit('message', {
                  sender: {
                    name: socketUserMapping[socket.id].nickname,
                    photo: socketUserMapping[socket.id].thumbnail
                  },
                  text: data.text
              });
            //私聊
          } else {
              //所有人
              socket.broadcast.to(data.room).emit('message', {
                  sender: {
                      name: socketUserMapping[socket.id].nickname,
                      photo: socketUserMapping[socket.id].thumbnail
                  },
                  text: data.text
              });
          }
        });

        socket.on('joinRoom', function(data) {
            joinRoom(socket, data.room);
        });

        socket.on('disconnect', function() {
            var oldRoom = socketRoomMapping[socket.id],
                userName = socketUserMapping[socket.id].nickname;

            socket.broadcast.to(oldRoom).emit('systemInfo', {
                text: userName + '离开了房间' + roomMapping[oldRoom]
            });
            socket.broadcast.to(oldRoom).emit('refreshRooms', rooms);
            socket.broadcast.to(oldRoom).emit('refreshUsers', getUsersInRoom(oldRoom));

            delete socketUserMapping[socket.id];
        });

    });
};