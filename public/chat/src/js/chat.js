(function ($) {
    $(function() {
        var chatUtil = (function () {
            var iconLib = {
                'signing': ' <i class="fa fa-signing"></i> ',
                'birthdayCake': ' <i class="fa fa-birthday-cake"></i> ',
                'bomb': ' <i class="fa fa-bomb"></i> ',
                'female': ' <i class="fa fa-female"></i> ',
                'handGrabO': ' <i class="fa fa-hand-grab-o"></i>' ,
                'handPeaceO': ' <i class="fa fa-hand-peace-o"></i> ',
                'handStopO': ' <i class="fa fa-hand-stop-o"></i> ',
                'heart': ' <i class="fa fa-heart"></i> ',
                'thumbsODown': ' <i class="fa fa-thumbs-o-down"></i> ',
                'thumbsOUp': ' <i class="fa fa-thumbs-o-up"></i> ',
                'rocket': ' <i class="fa fa-rocket"></i> ',
                'taxi': ' <i class="fa fa-taxi"></i> ',
                'twitter': ' <i class="fa fa-twitter"></i> '
            };
            return {
                escapeHTML: function (text) {
                    var p = document.createElement('div');
                    p.appendChild(document.createTextNode(text));
                    return p.innerHTML;
                },
                addIcons: function (str) {
                    var fas = str.match(/\/fa_\w*_/g);

                    if (fas) {
                        fas.forEach(function (item) {
                            var sub = item.slice(4, item.length - 1);

                            var icon = iconLib[sub] || item;

                            str = str.replace(item, icon);
                        });
                    }
                    
                    return str;
                }
            };
        }());
        var chatUI = (function() {
            var $rooms = $('#rooms'),
                $user = $('#user'),
                $users = $('#users'),
                $chatBoxWrapper = $('.chat-box'),
                $chatBox = $('#chat-box'),
                $chatForm = $('#chat-form'),
                $chatText = $('#chat-text');

            var setUser = function(user) {
                $user.text(user);
            };

            var setCurrentRoom = function(room) {
                $rooms.find('[data-chat-rid="' + room.id + '"]').addClass('active');
            };

            var setWisperTo = function(id) {
                if (!!id) {
                    $users.find('.active').removeClass('active');
                    $users.find('[data-chat-uid="' + id + '"]').addClass('active');
                } else {
                    $users.find('.active').removeClass('active');
                }
            };

            var setRoomList = function(roomList) {
                var html = '';
                roomList.forEach(function(item) {
                  html += '<a href="#" data-chat-rid="' + item.id + '" class="list-group-item"><span class="glyphicon glyphicon-home"></span> ' + item.name + '</a>';
                });

                $rooms.html(html);
            };

            var setUserList = function(userList) {
                var html = '';
                userList.forEach(function(item) {
                    html += '<a href="#" data-chat-uid="' + item.id + '" class="list-group-item"><span class="glyphicon glyphicon-user"></span> ' + item.name + '</a>';
                });

                $users.html(html);
            };

            var addMyMsg = function(msg, photo, name) {
                $chatBox.append('<li class="chat-msg clearfix"><p class="chat-name text-right">' + name + '</p><p class="bubble-right chat-bubble">' + chatUtil.addIcons(msg) + '</p><img class="img-thumbnail chat-photo-r" src="' + photo + '"></li>');
                $chatBoxWrapper.scrollTop($chatBox.height());
                $chatBoxWrapper.perfectScrollbar('update');
            };

            var addOtherMsg = function(msg, photo, name) {
                $chatBox.append('<li class="chat-msg clearfix"><p class="chat-name text-left">' + name + '</p><p class="bubble-left chat-bubble">' + chatUtil.addIcons(msg) + '</p><img class="img-thumbnail chat-photo-l" src="' + photo + '"></li>');
                $chatBoxWrapper.scrollTop($chatBox.height());
                $chatBoxWrapper.perfectScrollbar('update');
            };

            var init = function(onSendMsg, onSelectRoom, onSelectUser) {
                $chatText.on('keydown', function (e) {
                  if (e.keyCode === 13) {
                    $chatForm.trigger('submit');
                    e.preventDefault();
                    e.stopPropagation();
                  }
                });
                $chatForm.on('submit', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var msg = $chatText.val();
                    if (!msg.trim()) {
                        return;
                    }
                    $chatText.val('');
                    onSendMsg(chatUtil.escapeHTML(msg));
                });

                $rooms.delegate('[data-chat-rid]', 'click', function(e) {
                    onSelectRoom($(this).data('chatRid'));
                    e.preventDefault();
                    e.stopPropagation();
                });

                $users.delegate('[data-chat-uid]', 'click', function(e) {
                    onSelectUser($(this).data('chatUid'));
                    e.preventDefault();
                    e.stopPropagation();
                });

                $chatBoxWrapper.perfectScrollbar();
                $('#tooltip-icons-btn').popover({
                    html: true,
                    placement: 'top',
                    container: 'body',
                    trigger: 'focus',
                    content: $('#tooltip-icons').html()
                });

                $(document.body).delegate('.tooltip-icon', 'click', function () {
                    $chatText.val($chatText.val() + '/fa_' + $(this).data('fa') + '_');
                });
            };

            var clearChatBox = function () {
              $chatBox.empty();
            };

            var addSystemInfo = function (text) {
                $chatBox.append('<li class="sys-info"><span>' + text + '</span></li>');
                $chatBoxWrapper.scrollTop($chatBox.height());
                $chatBoxWrapper.perfectScrollbar('update');
            };

            return {
                setUser: setUser,
                setCurrentRoom: setCurrentRoom,
                setWisperTo: setWisperTo,
                setRoomList: setRoomList,
                setUserList: setUserList,
                addMyMsg: addMyMsg,
                addOtherMsg: addOtherMsg,
                init: init,
                clearChatBox: clearChatBox,
                addSystemInfo: addSystemInfo
            };
        }());


        (function() {
            var user,
                currentRoom,
                wisperTo,
                socket = io('/chat');

            socket.on('nameResult', function(data) {
                chatUI.setUser(data.name);
                user = data;
            });
            socket.on('joinResult', function(data) {
                currentRoom = data;
            });

            socket.on('systemInfo', function(data) {
                chatUI.addSystemInfo(data.text);
            });

            socket.on('refreshRooms', function(data) {
                chatUI.setRoomList(data);
                if (currentRoom) {
                    chatUI.setCurrentRoom(currentRoom);
                }
            });
            socket.on('refreshUsers', function(data) {
                chatUI.setUserList(data);
                if (wisperTo) {
                    chatUI.setWisperTo(wisperTo);
                }
            });

            chatUI.init(function(msg) {
                if (!!wisperTo) {
                    socket.emit('message', {
                        wisperTo: wisperTo,
                        text: msg
                    });
                } else {
                    socket.emit('message', {
                        room: currentRoom.id,
                        text: msg
                    });
                }

                chatUI.addMyMsg(msg, user.photo, user.name);
            }, function(room) {
                if (room === currentRoom.id) {
                    return;
                }
                socket.emit('joinRoom', {
                    room: room
                });
                chatUI.clearChatBox();
            }, function (target) {
                if (wisperTo === target || user.socketId === target) {
                    wisperTo = null;
                    chatUI.setWisperTo();
                    return;
                }

                wisperTo = target;
                chatUI.setWisperTo(wisperTo);
            });

            //监听消息事件
            socket.on('message', function(data) {
                chatUI.addOtherMsg(data.text, data.sender.photo, data.sender.name);
            });

        }());
    });
} (jQuery));