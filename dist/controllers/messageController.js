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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utility = require('../helpers/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var messageController = function () {
    function messageController() {
        _classCallCheck(this, messageController);
    }

    _createClass(messageController, [{
        key: 'getMessages',
        value: async function getMessages(id, page) {
            try {
                var _constants$message = _constants2.default.message,
                    receiver = _constants$message.receiver,
                    sender = _constants$message.sender;

                var messageStatus = 0;
                var options = {
                    sort: {
                        createdAt: -1
                    },
                    lean: true,
                    page: page,
                    limit: 10
                };
                var messages = await _Message2.default.paginate({
                    $or: [{
                        from: id
                    }, {
                        to: id
                    }]
                }, options);
                messages.docs = _lodash2.default.map(messages.docs, function (item) {
                    if (item.from == id) {
                        messageStatus = sender;
                    } else {
                        messageStatus = receiver;
                    }
                    return {
                        messageStatus: messageStatus,
                        id: item._id,
                        createdAt: _utility2.default.getPersianDate(item.createdAt),
                        text: item.message,
                        type: item.type,
                        seen: item.seen
                    };
                });
                console.log(messages);
                return messages;
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'getMessage',
        value: async function getMessage(data, token) {
            try {
                var user = await _User2.default.findOne({
                    token: token
                });

                if (typeof data.id === 'undefined') {
                    data.id = "5c8621fbfa3a65776cda5377";
                }

                var userToken = await _User2.default.findOne({
                    _id: data.id
                });

                return new _Message2.default({
                    message: data.text,
                    from: user._id,
                    to: data.id,
                    type: data.type,
                    token: userToken.token
                }).save();
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }, {
        key: 'getAllMessages',
        value: async function getAllMessages() {
            try {
                var messages = await _Message2.default.find().sort('createdAt');
                res.json(messages);
            } catch (err) {
                console.warn(err);
                return null;
            }
        }
    }]);

    return messageController;
}();

exports.default = new messageController();