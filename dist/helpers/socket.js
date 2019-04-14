"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _messageController = require("../controllers/messageController");

var _messageController2 = _interopRequireDefault(_messageController);

var _userController = require("../controllers/userController");

var _userController2 = _interopRequireDefault(_userController);

var _utility = require("../helpers/utility");

var _utility2 = _interopRequireDefault(_utility);

var _constants = require("../configs/constants");

var _constants2 = _interopRequireDefault(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

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
            var self = this.io;
            self.on("connection", function (socket) {
                var token = socket.handshake.query.token;
                console.log("connected: " + token);

                _userController2.default.updateOnlineUser(token, _constants2.default.user.onlineStatus.online);

                socket.broadcast.emit("getUsers", 'ok');

                socket.on("getAllMessage-" + token, function (data) {
                    _messageController2.default.getMessages(token, data.page, data.chat_title_id).then(function (res) {
                        try {
                            socket.emit("sendAllMessage-" + token, res);
                        } catch (err) {
                            console.log(err);
                        }
                    });
                });

                socket.on("sendImage-" + token, function (data) {
                    var fileName = __dirname + '/../../uploads/' + _lodash2.default.random(1000000000, 9999999999) + '_' + data.imageName;
                    data.fileName = fileName;
                    _fs2.default.open(fileName, 'a', function (err, fd) {
                        if (err) throw err;
                        _fs2.default.write(fd, data.filePath, null, 'Binary', function (err, written, buff) {
                            try {
                                _fs2.default.close(fd, function () {
                                    _messageController2.default.setMessage(data, token).then(function (res) {
                                        try {
                                            socket.emit("ImageStatus-" + token, {
                                                'status': true
                                            });
                                        } catch (err) {
                                            socket.emit("ImageStatus-" + token, err);
                                        }
                                    });
                                });
                            } catch (err) {
                                socket.emit("ImageStatus-" + token, err);
                            }
                        });
                    });
                });

                socket.on("sendMessage-" + token, function (data) {
                    _messageController2.default.setMessage(data, token).then(function (result) {
                        console.log(result);
                        try {
                            var userToken = result.to;
                            self.emit("getMessage-" + userToken, {
                                id: result._id,
                                text: result.message,
                                createdAt: _utility2.default.getPersianTime(result.createdAt),
                                type: result.type,
                                messageStatus: 1,
                                seen: result.seen,
                                file: result.file,
                                date: _utility2.default.getPersianDate(result.createdAt)
                            });
                            socket.emit("received-" + token, {
                                id_msg: data.id_msg,
                                status: true
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    });
                });

                socket.on("typing-" + token, function (data) {
                    if (typeof data === "undefined") {
                        self.emit("typing-admin", {
                            token: token
                        });
                    } else {
                        console.log(data);
                        self.emit("typing-" + data.token);
                    }
                });

                socket.on("disconnect", async function () {
                    _userController2.default.updateOnlineUser(token, _constants2.default.user.onlineStatus.offline);
                    socket.broadcast.emit("getUsers", 'ok');
                });
            });
        }
    }]);

    return Socket;
}();

exports.default = Socket;