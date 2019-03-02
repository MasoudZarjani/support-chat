'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('../configs/db');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
    function Socket(socket) {
        _classCallCheck(this, Socket);

        this.io = socket;
        (0, _db.mongodb)();
    }

    _createClass(Socket, [{
        key: 'socketEvents',
        value: function socketEvents() {
            this.io.on('connection', function (socket) {
                console.log(socket.id);
                socket.on('sendMessage', function (data) {
                    console.log(data);
                    socket.emit('message', data);
                });

                socket.on('disconnect', async function () {
                    socket.emit('chatListRes', {
                        userDisconnected: true,
                        socket_id: socket.id
                    });
                });
            });
        }
    }]);

    return Socket;
}();

exports.default = Socket;