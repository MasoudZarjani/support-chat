"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
    function Socket(socket) {
        _classCallCheck(this, Socket);

        this.io = socket;
    }

    _createClass(Socket, [{
        key: "socketEvents",
        value: function socketEvents() {
            this.io.on("connection", function (socket) {
                var token = socket.handshake.query.token;
                console.log(token);
                console.log("user connect");

                //send message from admin to a user
                socket.on("sendMessage", function (data) {
                    var token = data.token;
                    socket.emit("getMessage-" + token, data);
                });

                //send message from user to admins
                socket.on("sendMessage-" + token, function (data) {
                    console.log(data);
                    socket.emit("getMessage", {
                        token: token,
                        data: data
                    });
                });

                socket.on("GetUsersList", function (data) {});

                socket.on("disconnect", async function () {
                    socket.emit("chatListRes", {
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