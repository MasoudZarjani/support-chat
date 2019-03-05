"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                    socket.emit("getMessage-" + token, data);
                });

                //get file and save in uploads folder
                socket.on("sendFile-" + token, function (data) {
                    console.log(" image response: " + data);
                    //use fs.writeFile

                    data = data.replace(/^data:image\/png;base64,/, "");

                    _fs2.default.writeFile("out.png", data, 'base64', function (err) {
                        console.log(err);
                    });

                    socket.emit("getMessage-" + token, {
                        data: 'ok'
                    });
                });

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