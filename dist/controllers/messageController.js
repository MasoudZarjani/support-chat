'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _constants = require('../configs/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var messageController = function () {
    function messageController() {
        _classCallCheck(this, messageController);
    }

    _createClass(messageController, [{
        key: 'getMessages',
        value: async function getMessages(id) {
            try {
                var _constants$message = _constants2.default.message,
                    receiver = _constants$message.receiver,
                    sender = _constants$message.sender;

                var messageStatus = 0;
                var MessageList = [];
                var messages = await _Message2.default.find({
                    $or: [{
                        from: id
                    }, {
                        to: id
                    }]
                }).sort('createdAt');
                messages.forEach(function (message) {
                    if (message.from == id) {
                        messageStatus = sender;
                    } else {
                        messageStatus = receiver;
                    }
                    MessageList.push({
                        id: message._id,
                        text: message.message,
                        messageStatus: messageStatus
                    });
                });
                return MessageList;
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'getMessage',
        value: async function getMessage(data, token) {
            try {
                var user = await _User2.default.find({
                    token: token
                });
                new _Message2.default({
                    message: data.text,
                    from: user._id,
                    to: data.id
                }).save(function (err) {
                    if (err) throw err;
                });
                return true;
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }]);

    return messageController;
}();

exports.default = new messageController();