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

                _userController2.default.onlineStatus(token, _constants2.default.user.onlineStatus.online);

                socket.on("getAllMessage-" + token, function (data) {
                    _userController2.default.getUser(token).then(function (result) {
                        try {
                            _messageController2.default.getMessages(result._id, data.page).then(function (res) {
                                try {
                                    socket.emit("sendAllMessage-" + token, res);
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    });
                });

                //get admin messages list
                socket.on("getMessages-" + token, function (data) {
                    if (typeof data.id === "undefined") {
                        user = _userController2.default.getUser(token);
                        data = {
                            id: user.id
                        };
                    }
                    _messageController2.default.getMessages(data.id, data.page).then(function (result) {
                        socket.emit("sendMessages-" + token, result);
                    });
                });

                socket.on("sendMessage-" + token, function (data) {
                    _messageController2.default.getMessage(data, token).then(function (result) {
                        try {
                            var userToken = result.token;
                            self.emit("getMessage-" + userToken, {
                                id: result._id,
                                text: result.message,
                                createdAt: _utility2.default.getPersianTime(result.createdAt),
                                type: result.type,
                                messageStatus: 1
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
                    if (typeof data === 'undefined') {
                        self.emit("typing-admin", {
                            typing: null
                        });
                    } else {
                        var id = data.id;
                        _userController2.default.getToken(id).then(function (result) {
                            try {
                                var userToken = result.token;
                                console.log(userToken);
                                self.emit("typing-" + userToken);
                            } catch (err) {}
                        });
                    }
                });

                //get file and save in uploads folder
                socket.on("sendFile-" + token, function (data) {
                    //use fs.writeFile
                    data = data.image;
                    data = data.replace(/^data:image\/png;base64,/, "");

                    _fs2.default.writeFile("out.png", data, "base64", function (err) {
                        console.log(err);
                    });

                    socket.emit("getMessage-" + token, {
                        sendMessage: "ok"
                    });
                });

                socket.on("disconnect", async function () {
                    _userController2.default.onlineStatus(token, _constants2.default.user.onlineStatus.offline);
                });
            });
        }
    }]);

    return Socket;
}();

exports.default = Socket;